import type { IUserActor } from "../../domain/entities/user-actor.js";
import type { UserProfile } from "../../domain/entities/user-profile.js";
import type { UserAccessPolicy } from "../../domain/policies/user-access-policy.js";
import { UserAccessDeniedError, UserDeletedError, UserNotFoundError, type ApplicationError } from "../errors/application-errors.js";
import type { IUserProfileGateway } from "../gateways/user-profile-gateway.js";
import { isDeletedUserEmail } from "../../domain/entities/user.js";

export type AccessCheckResult = 
| {readonly granted: true; readonly profile: UserProfile}
| {readonly granted: false; readonly failure: ApplicationError};

// Comprobación común a las acciones sobre un usuario: que exista y que haya permiso.
export class UserAccessChecker {
    constructor (
        private readonly profiles: IUserProfileGateway,
        private readonly accessPolicy: UserAccessPolicy
    ){}

    async check( actor: IUserActor, targetUserId: number): Promise<AccessCheckResult>{
        const profile = await this.profiles.findProfileById(targetUserId);
        if (!profile) {
            return {granted: false, failure: new UserNotFoundError(targetUserId)};
        }

        // Un usuario borrado o desactivado ya no existe como objetivo:
        // ni siquiera un administrador puede operar sobre él.
        if (!profile.active) {
            // El marcador deleted{id} en el email distingue eliminado de desactivado.
            return {
                granted: false,
                failure: isDeletedUserEmail(profile.email)
                    ? new UserDeletedError()
                    : new UserNotFoundError(targetUserId),
            };
        }

        if (!this.accessPolicy.canAccess(actor, profile.idUser, profile.role)){
            return {granted: false, failure: new UserAccessDeniedError(actor.role, profile.role)};
        }

        return { granted: true, profile };
    }
}