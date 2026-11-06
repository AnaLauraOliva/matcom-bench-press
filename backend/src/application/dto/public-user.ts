import type { Role } from "../../domain/entities/role.js";
import type { IUser } from "../../domain/entities/user.js";

export interface IPublicUser {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly role: Role;
    readonly active: boolean;
    readonly registerDate: Date;
}

export function toPublicUser(user: IUser): IPublicUser {
    return {
        id: user.idUser,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
        registerDate: user.registerDate
    };
}
