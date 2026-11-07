import type { Role } from "../../domain/entities/role.js";  
import type { IUser } from "../../domain/entities/user.js";

// Datos públicos de un usuario

export interface IUserResponse {
    readonly idUser: number;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly role: Role;
    readonly active: boolean;
    readonly registerDate: Date;
}

export function toUserResponse(user: IUser): IUserResponse {
    return {
        idUser: user.idUser,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
        registerDate: user.registerDate
    };
}