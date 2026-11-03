import type { IUserActor } from "../../domain/entities/user-actor.js";
import type { UserProfile } from "../../domain/entities/user-profile.js";
import { UserAccessDeniedError, UserNotFoundError } from "../../domain/errors/domain-errors.js";
import type { UserAccessPolicy } from "../../domain/policies/user-access-policy.js";
import type { IUserManagementRepository } from "../../domain/repositories/user-management-repository.js";

export class UserAccessGuard {
    constructor(
        private readonly userRepository: IUserManagementRepository,
        private readonly accessPolicy: UserAccessPolicy,
    ){}

    async ensureCanAccess(actor: IUserActor, targetUserId: number): Promise<UserProfile>{
        const profile = await this.userRepository.findProfileById(targetUserId);
        if(!profile) throw new UserNotFoundError(targetUserId);

        if(!this.accessPolicy.canAccess(actor, profile.id, profile.role)) {
            throw new UserAccessDeniedError(actor.role, profile.role);
        }
        return profile;
    }
}