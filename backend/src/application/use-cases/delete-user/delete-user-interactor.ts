import { UserNotFoundError } from "../../errors/application-errors.js";
import type { IUserProfileGateway } from "../../gateways/user-profile-gateway.js";
import type { ITargetUserRequest } from "../../models/target-user-request.js";
import type { UserAccessChecker } from "../../services/user-access-checker.js";
import type { IDeleteUserInputBoundary, IDeleteUserOutputBoundary } from "./delete-user-boundaries.js";

// Este es el borrado real, lo que pasa realmente es que menos el id y el email todos los campos se hacen null y el email pasa a ser deleted+id
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

        const deleted = await this.profiles.deleteById(req.targetUserId);
        if(!deleted) {
            output.presentFailure(new UserNotFoundError(req.targetUserId));
            return;
        }

        output.presentSuccess();
    }
}