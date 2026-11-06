import { LastAdminError, UserNotFoundError } from "../../errors/application-errors.js";
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

        // Regla "siempre debe existir al menos un administrador activo":
        // la evalúa de forma atómica el data source dentro de su transacción,
        // así que ninguna sucesión de desactivaciones concurrentes puede dejar
        // la base sin administradores. Aquí solo traducimos el resultado.
        const outcome = await this.profiles.deactivateById(
            req.targetUserId,
        );
        if (outcome === "not-found") {
            output.presentFailure(new UserNotFoundError(req.targetUserId));
            return;
        }
        if (outcome === "last-admin") {
            output.presentFailure(new LastAdminError());
            return;
        }
        output.presentSuccess();
    }
}
