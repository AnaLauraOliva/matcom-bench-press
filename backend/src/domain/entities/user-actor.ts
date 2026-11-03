import type { Role } from "./role.js";
export interface IUserActor{
    readonly id: number;
    readonly role: Role;
}