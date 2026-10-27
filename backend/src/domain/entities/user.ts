import type { Role } from "./role.js";
import type { Sex } from "./sex.js";

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

interface IBaseNewUserData {
    readonly phone: string;
    readonly name: string;
    readonly email: string;
    readonly passwordHash: string;
}
//unión disciminada por roles, por ahora solo cliente
export type NewUser = 
    | (IBaseNewUserData & {
        readonly role: 'CLIENT';
        readonly age: number;
        readonly sex: Sex;
        readonly locationName: string;
    });

    