import type { Role } from "./role.js";
export interface IUserActor{
    readonly idUser: number;
    readonly role: Role;
}