import type { Role } from "../entities/role.js";
import type { IUserActor } from "../entities/user-actor.js";
import type { RegistrationPolicy } from "./registration-policy.js";

export class UserAccessPolicy {
    constructor(
        private readonly registrationPolicy: RegistrationPolicy
    ){}

    canAccess(actor: IUserActor, targetId: number, targetRole: Role): boolean {
        if(actor.idUser === targetId) return true;
        return this.registrationPolicy.canRegister(actor.role, targetRole);
    }
}