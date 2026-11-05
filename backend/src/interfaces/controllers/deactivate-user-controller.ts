import type { ITargetUserRequest } from "../../application/models/target-user-request.js";
import type { IDeactivateUserInputBoundary } from "../../application/use-cases/deactivate-user/deactivate-user-boundaries.js";
import type { IHttpResponse } from "../http/http-types.js";
import type { SessionResolver } from "../http/session-resolver.js";
import { DeactivateUserPresenter } from "../presenters/deactivate-user-presenter.js";
import { TargetUserController } from "./target-user-controller.js";
export class DeactivateUserController extends TargetUserController {
    constructor(
        sessions: SessionResolver,
        private readonly deactivateUser: IDeactivateUserInputBoundary,
    ) {
        super(sessions);
    }
    protected async run(request: ITargetUserRequest): Promise<IHttpResponse> {
        const presenter = new DeactivateUserPresenter();
        await this.deactivateUser.execute(request, presenter);
        return presenter.getViewModel();
    }
}
