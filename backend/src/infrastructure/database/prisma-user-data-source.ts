import { EmailAlreadyExistsError, PhoneAlreadyExistsError } from "../../application/errors/application-errors.js";
import type {
    NewUserRecord,
    IUserDataSource,
    IUserRecord,
} from "../../interfaces/data-sources/user-data-source.js";
import type { PrismaClient } from "./prisma-client.js";

const INCLUDE_ROLE_TABLES = {
    admin: true,
    trainer: { include: { headTrainer: true } },
    client: true,
} as const;

interface IUserRow {
    idUser: number;
    phone: string | null;
    registerDate: Date;
    active: boolean;
    name: string | null;
    email: string;
    password: string | null;

    client: object | null;
    admin: object | null;
    trainer: { headTrainer: object | null } | null;
}

function toRecord(row: IUserRow): IUserRecord {
    return {
        idUser: row.idUser,
        phone: row.phone !== null ? row.phone : "UNKNOWN",
        registerDate: row.registerDate,
        active: row.active,
        name: row.name !== null ? row.name : "DELETED_USER",
        email: row.email,
        passwordHash: row.password != null ? row.password : "UNKNOWN",

        isAdmin: row.admin !== null,
        isTrainer: row.trainer
            ? { isHeadTrainer: row.trainer.headTrainer !== null }
            : null,
        isClient: row.client !== null,
    };
}

// P2002 significa que se violó una restricción UNIQUE/PRIMARY, pero puede ser
// cualquiera. Si Prisma reporta el índice (meta.target), solo lo tratamos como
// email duplicado cuando la restricción violada es la del email; si no hay
// detalle disponible, asumimos que es el email (hipótesis conservadora).
function violatedIndex(error: unknown): string {
    if (!(typeof error === "object" && error !== null && "code" in error && error.code === "P2002"))
        return "";
    const meta = (error as {meta?: Record<string, unknown> }).meta;
    const idx = (meta as { driverAdapterError?: { cause?: { constraint?: { index?: string } } } })
        ?.driverAdapterError?.cause?.constraint?.index;
    if (typeof idx === "string") return idx.toLowerCase();   // "Usuario_telefono_key"
    const target = meta?.target;
    if (typeof target === "string") return target.toLowerCase();
    if (Array.isArray(target)) return target.filter(f => typeof f === "string").join(",").toLowerCase();
    return "";
}
function roleTableData(record: NewUserRecord) {
    switch (record.role) {
        case "admin":
            return { admin: { create: {} } };
        case "trainer":
            return {
                trainer: {
                    create: {
                        specialty: record.specialty,
                        headTrainer: record.isHeadTrainer
                            ? { create: {} }
                            : undefined,
                    },
                },
            };
        case "client":
            return {
                client: {
                    create: {
                        age: record.age,
                        gender: record.gender,
                        location: {
                            connect: { idLocation: record.idLocation },
                        },
                    },
                },
            };
    }
}

export class PrismaUserDataSource implements IUserDataSource {
    constructor(private readonly prisma: PrismaClient) {}

    async findByEmail(email: string): Promise<IUserRecord | null> {
        const row = await this.prisma.user.findUnique({
            where: { email },
            include: INCLUDE_ROLE_TABLES,
        });
        return row ? toRecord(row) : null;
    }
    async insert(record: NewUserRecord): Promise<IUserRecord> {
        try {
            const row = await this.prisma.user.create({
                data: {
                    phone: record.phone,
                    name: record.name,
                    email: record.email,
                    password: record.passwordHash,
                    ...roleTableData(record)
                },
                include: INCLUDE_ROLE_TABLES
            });
            return toRecord(row);
        } catch (error){
            const idx = violatedIndex(error);
            if(idx.includes("email")) throw new EmailAlreadyExistsError();
            else if(idx.includes("telefono")) throw new PhoneAlreadyExistsError();
            throw error;
        }
    }
}
