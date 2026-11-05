import { UserNotFoundError } from "../../errors/application-errors.js";
import type { IUserProfileGateway } from "../../gateways/user-profile-gateway.js";
import type { ITargetUserRequest } from "../../models/target-user-request.js";
import type { UserAccessChecker } from "../../services/user-access-checker.js";
import type {
    IDeactivateUserInputBoundary,
    IDeactivateUserOutputBoundary,
} from "./deactivate-user-boundaries.js";
// BORRADO LÓGICO: el usuario se conserva pero queda desactivado y ya no puede iniciar sesión.
// Si ya estaba desactivado, no pasa nada.
export class DeactivateUserInteractor implements IDeactivateUserInputBoundary {
    constructor(
        private readonly accessChecker: UserAccessChecker,
        private readonly profiles: IUserProfileGateway,
    ) {}
    async execute(
        req: ITargetUserRequest,
        output: IDeactivateUserOutputBoundary,
    ): Promise<void> {
        const access = await this.accessChecker.check(
            req.actor,
            req.targetUserId,
        );
        if (!access.granted) {
            output.presentFailure(access.failure);
            return;
        }
        const deactivated = await this.profiles.deactivateById(
            req.targetUserId,
        );
        if (!deactivated) {
            output.presentFailure(new UserNotFoundError(req.targetUserId));
            return;
        }
        output.presentSuccess();
    }
}
