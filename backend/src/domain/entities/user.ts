import type { Role } from "./role.js";
import type { Gender } from "./gender.js";

export interface IUser {
    readonly idUser: number;
    readonly phone: string;
    readonly registerDate: Date;
    readonly active: boolean;
    readonly name: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly role: Role;
}

// Al borrar (soft delete) el email se reescribe como "deleted{id}".
// Con este marcador se distingue un usuario ELIMINADO de uno solo DESACTIVADO.
const DELETED_EMAIL_PATTERN = /^deleted\d+$/;
export function isDeletedUserEmail(email: string): boolean {
    return DELETED_EMAIL_PATTERN.test(email);
}

interface INewUserBase {
    readonly phone: string;
    readonly name: string;
    readonly email: string;
    readonly passwordHash: string;
}
//unión disciminada por roles
export type NewUser = 
    | (INewUserBase & {
        readonly role: 'CLIENT';
        readonly age: number;
        readonly gender: Gender;
        readonly idLocation: number;
    })
    | (INewUserBase &{readonly role: 'ADMIN'})
    | (INewUserBase &{
        readonly role: 'TRAINER' | 'HEAD_TRAINER';
        readonly specialty: string;
    });

    