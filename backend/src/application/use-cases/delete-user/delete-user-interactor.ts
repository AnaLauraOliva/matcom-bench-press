import { LastAdminError, UserNotFoundError } from "../../errors/application-errors.js";
import type { IUserProfileGateway } from "../../gateways/user-profile-gateway.js";
import type { ITargetUserRequest } from "../../models/target-user-request.js";
import type { UserAccessChecker } from "../../services/user-access-checker.js";
import type { IDeleteUserInputBoundary, IDeleteUserOutputBoundary } from "./delete-user-boundaries.js";

// Este es el "borrado real", lo que pasa realmente es que menos el id y el email todos los campos se hacen null y el email pasa a ser deleted+id
// Esto se hace con el objetivo de que no se borren las rutinas creadas por ese entrenador o que se haga referencia a un id que no exista
export class DeleteUserInteractor implements IDeleteUserInputBoundary {
    constructor(
        private readonly accessChecker: UserAccessChecker,
        private readonly profiles: IUserProfileGateway
    ){}

    async execute(req: ITargetUserRequest, output: IDeleteUserOutputBoundary): Promise<void> {
        const access = await this.accessChecker.check(req.actor, req.targetUserId);
        if(!access.granted){
            output.presentFailure(access.failure);
            return;
        }

        // Regla "siempre debe existir al menos un administrador activo":
        // la evalúa de forma atómica el data source dentro de su transacción,
        // así que ninguna sucesión de borrados concurrentes puede dejar la
        // base sin administradores. Aquí solo traducimos el resultado a errores.
        const outcome = await this.profiles.deleteById(req.targetUserId);
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