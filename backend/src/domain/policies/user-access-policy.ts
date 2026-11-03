import type { Role } from "../entities/role.js";
import type { IUserActor } from "../entities/user-actor.js";
import type { RegisterPolicy } from "./register-policy.js";

export class UserAccessPolicy {
    constructor(
        private readonly registrationPolicy: RegisterPolicy
    ){}

    canAccess(actor: IUserActor, targetId: number, targetRole: Role): boolean {
        if(actor.id === targetId) return true;
        return this.registrationPolicy.canRegister(actor.role, targetRole);
    }
}