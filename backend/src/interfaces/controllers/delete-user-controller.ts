import type { ITargetUserRequest } from "../../application/models/target-user-request.js";
import type { IDeleteUserInputBoundary } from "../../application/use-cases/delete-user/delete-user-boundaries.js";
import type { IHttpResponse } from "../http/http-types.js";
import type { SessionResolver } from "../http/session-resolver.js";
import { DeleteUserPresenter } from "../presenters/delete-user-presenter.js";
import { TargetUserController } from "./target-user-controller.js";
export class DeleteUserController extends TargetUserController {
    constructor(
        sessions: SessionResolver,
        private readonly deleteUser: IDeleteUserInputBoundary,
    ) {
        super(sessions);
    }
    protected async run(request: ITargetUserRequest): Promise<IHttpResponse> {
        const presenter = new DeleteUserPresenter();
        await this.deleteUser.execute(request, presenter);
        return presenter.getViewModel();
    }
}
