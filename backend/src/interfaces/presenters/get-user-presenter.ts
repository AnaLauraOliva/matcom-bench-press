import type {
    IGetUserOutputBoundary,
    IGetUserResponse,
} from "../../application/use-cases/get-user/get-user-boundaries.js";
import { ok } from "../http/http-responses.js";
import { BasePresenter } from "./base-presenter.js";
export class GetUserPresenter
    extends BasePresenter
    implements IGetUserOutputBoundary
{
    presentSuccess(response: IGetUserResponse): void {
        this.respond(ok({ user: response.user }));
    }
}
