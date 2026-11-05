import { create } from "domain";
import { EmailAlreadyExistsError } from "../../application/errors/application-errors.js";
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

function isUniqueViolation(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
    );
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
    async findByName(name: string): Promise<IUserRecord[]> {
        const rows = await this.prisma.user.findMany({
            where: { name },
            include: INCLUDE_ROLE_TABLES,
        });
        return rows.map(toRecord);
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
            if(isUniqueViolation(error)) throw new EmailAlreadyExistsError();
            throw error;
        }
    }
}
