import type { Role }from "../../../domain/entities/role.js";
import type { IUser } from "../../../domain/entities/user.js";

//Le indica a Prisma que al traer un usuario, tambien traiga a sus especializaciones
// Para que TypeScript deduzca bien el resultado, se pone el as const

export const INCLUDE_ROLE = {
    client: true,
    admin: true,
    trainer: {include: {headTrainer: true}}
} as const;

// Forma m'inima de una fila que devuelve Prisma con INCLUDE_ROLE
export interface IUserRow {
    idUser: number;
    name: string;
    email: string;
    phone: string;
    active: boolean;
    registerDate: Date;
    password: string;
    client: object | null;
    admin: object | null;
    trainer: {headTrainer: object | null} | null;
}

// El rol no se guarda como un campo, se deduce de en que tabla de especializaci'on est'a el usuario
export function delegateRole(row: IUserRow): Role {
    if (row.client) return 'CLIENT';
    if (row.active) return 'ADMIN';
    if (row.trainer) return row.trainer.headTrainer ? 'HEAD_TRAINER' : 'TRAINER';
    throw new Error(`El usuario ${row.idUser} no tiene un rol asignado (datos inconsistentes).`);
}

export function toUser(row: IUserRow): IUser {
    return {
        idUser: row.idUser,
        name: row.name,
        email: row.email,
        phone: row.phone,
        role: delegateRole(row),
        active: row.active,
        registerDate: row.registerDate,
        passwordHash: row.password
    };
}