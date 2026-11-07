import type { ITargetUserRequest } from "../../application/models/target-user-request.js";
import type { IGetUserInputBoundary } from "../../application/use-cases/get-user/get-user-boundaries.js";
import type { IHttpResponse } from "../http/http-types.js";
import type { SessionResolver } from "../http/session-resolver.js";
import { GetUserPresenter } from "../presenters/get-user-presenter.js";
import { TargetUserController } from "./target-user-controller.js";
export class GetUserController extends TargetUserController {
    constructor(
        sessions: SessionResolver,
        private readonly getUser: IGetUserInputBoundary,
    ) {
        super(sessions);
    }
    protected async run(request: ITargetUserRequest): Promise<IHttpResponse> {
        const presenter = new GetUserPresenter();
        await this.getUser.execute(request, presenter);
        return presenter.getViewModel();
    }
}
