import { Prisma } from "./generated/client.js";
import type { Gender } from "../../domain/entities/gender.js";
import type { DestructiveOutcome } from "../../application/gateways/user-profile-gateway.js";
import type {
    IUserProfileDataSource,
    IUserProfileRecord,
} from "../../interfaces/data-sources/user-profile-data-source.js";
import type { PrismaClient } from "./prisma-client.js";
// "Trae el usuario con su tabla de rol y, si es cliente, también su sede".
const INCLUDE_PROFILE = {
    admin: true,
    trainer: { include: { headTrainer: true } },
    client: { include: { location: true } },
} as const;
// La forma mínima de una fila que devuelve Prisma con INCLUDE_PROFILE.
interface ProfileRow {
    idUser: number;
    phone: string | null;
    registerDate: Date;
    active: boolean;
    name: string | null;
    email: string;
    admin: object | null;
    trainer: { specialty: string; headTrainer: object | null } | null;
    client: {
        age: number;
        gender: Gender;
        location: { idLocation: number; name: string; address: string };
    } | null;
}
function toRecord(row: ProfileRow): IUserProfileRecord {
    return {
        idUser: row.idUser,
        phone: row.phone !== null ? row.phone : "UNKNOWN",
        registerDate: row.registerDate,
        active: row.active,
        name: row.name != null ? row.name : "DELETED_USER",
        email: row.email,
        isAdmin: row.admin !== null,
        trainer: row.trainer
            ? {
                  specialty: row.trainer.specialty,
                  isHeadTrainer: row.trainer.headTrainer !== null,
              }
            : null,
        client: row.client
            ? {
                  age: row.client.age,
                  gender: row.client.gender,
                  location: {
                      id: row.client.location.idLocation,
                      name: row.client.location.name,
                      address: row.client.location.address,
                  },
              }
            : null,
    };
}
// P2025 es el código que usa Prisma cuando se intenta borrar o actualizar algo que no existe.
function isRecordNotFound(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2025"
    );
}
// Clave fija del advisory lock de Postgres que serializa todas las operaciones
// destructivas sobre usuarios (bajas y desactivaciones). Cada transacción toma
// el lock y Postgres lo libera solo al commit/rollback: así dos peticiones
// concurrentes (por ejemplo, dos administradores borrándose mutuamente) se
// ordenan una tras otra, el conteo de admins que cada una evalúa ya incluye el
// efecto de la anterior, y nunca pueden dejar la base sin administradores.
const DESTRUCTIVE_LOCK_KEY = 738197200n;

// Toma el lock dentro de la transacción actual.
function lockDestructiveOps(tx: Prisma.TransactionClient): Promise<unknown> {
    return tx.$executeRaw`SELECT pg_advisory_xact_lock(${DESTRUCTIVE_LOCK_KEY}::bigint)`;
}
export class PrismaUserProfileDataSource implements IUserProfileDataSource {
    constructor(private readonly prisma: PrismaClient) {}
    async findById(idUser: number): Promise<IUserProfileRecord | null> {
        const row = await this.prisma.user.findUnique({
            where: { idUser: idUser },
            include: INCLUDE_PROFILE,
        });
        return row ? toRecord(row) : null;
    }
    async deleteById(idUser: number): Promise<DestructiveOutcome> {
        return this.prisma.$transaction(async (tx) => {
            await lockDestructiveOps(tx);
            return this.applyDestructive(tx, idUser, () => ({
                // Borrado suave: la fila y sus tablas de rol se conservan;
                // el email pasa a "deleted{id}" y el resto se enmascara.
                name: null,
                phone: null,
                password: null,
                active: false,
                email: `deleted${idUser}`,
            }));
        });
    }
    async deactivateById(idUser: number): Promise<DestructiveOutcome> {
        return this.prisma.$transaction(async (tx) => {
            await lockDestructiveOps(tx);
            return this.applyDestructive(tx, idUser, () => ({ active: false }));
        });
    }
    // Ejecuta el cambio destructivo con el lock ya tomado:
    // 1. verifica el objetivo,
    // 2. aplica la regla "siempre debe existir al menos un administrador activo"
    //    de forma indivisible (ningún otro proceso destructivo puede colarse en medio),
    // 3. actualiza.
    private async applyDestructive(
        tx: Prisma.TransactionClient,
        idUser: number,
        data: () => Prisma.UserUpdateInput,
    ): Promise<DestructiveOutcome> {
        const target = await tx.user.findUnique({
            where: { idUser: idUser },
            select: { active: true, admin: true },
        });
        if (!target) return "not-found";

        // Solo la baja de un ADMIN activo puede dejar la base sin admins:
        // quitar a un no-admin (o a un admin ya inactivo) no cambia ese conteo.
        if (target.active && target.admin !== null) {
            const otherActiveAdmins = await tx.user.count({
                where: {
                    active: true,
                    idUser: { not: idUser },
                    admin: { isNot: null },
                },
            });
            if (otherActiveAdmins === 0) return "last-admin";
        }

        try {
            await tx.user.update({ where: { idUser: idUser }, data: data() });
            return "ok";
        } catch (error) {
            if (isRecordNotFound(error)) return "not-found";
            throw error;
        }
    }
}
