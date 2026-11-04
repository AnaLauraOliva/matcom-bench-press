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

    