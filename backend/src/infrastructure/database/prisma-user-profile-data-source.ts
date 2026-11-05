import type { Gender } from "../../domain/entities/gender.js";
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
        name: row.name != null ? row.name : "DELETED USER",
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
export class PrismaUserProfileDataSource implements IUserProfileDataSource {
    constructor(private readonly prisma: PrismaClient) {}
    async findById(idUser: number): Promise<IUserProfileRecord | null> {
        const row = await this.prisma.user.findUnique({
            where: { idUser: idUser },
            include: INCLUDE_PROFILE,
        });
        return row ? toRecord(row) : null;
    }
    async deleteById(idUser: number): Promise<boolean> {
        return this.existedBefore(() =>
            this.prisma.user.update({
                where: { idUser: idUser },
                data: {
                    name: null,
                    phone: null,
                    password: null,
                    active: false,
                    email: `deleted${idUser}`,
                },
            }),
        );
    }
    async deactivateById(idUser: number): Promise<boolean> {
        return this.existedBefore(() =>
            this.prisma.user.update({
                where: { idUser: idUser },
                data: { active: false },
            }),
        );
    }
    // Ejecuta la operación y responde si el usuario existía (true) o no (false).
    private async existedBefore(
        operation: () => Promise<unknown>,
    ): Promise<boolean> {
        try {
            await operation();
            return true;
        } catch (error) {
            if (isRecordNotFound(error)) return false;
            throw error;
        }
    }
}
