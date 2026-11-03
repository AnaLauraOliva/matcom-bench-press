import type { IUserActor } from "../../domain/entities/user-actor.js";

export interface TargetUserInput {
    readonly actor: IUserActor;
    readonly targetId: number;
}