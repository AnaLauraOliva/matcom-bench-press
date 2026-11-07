import type { IUserActor } from "../../domain/entities/user-actor.js";

// Datos de entrada comunes a las acciones sobre un usuario concreto
export interface ITargetUserRequest {
    readonly actor: IUserActor;
    readonly targetUserId: number;
}