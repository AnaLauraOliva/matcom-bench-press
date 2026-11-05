import type {
    ILoginOutputBoundary,
    ILoginResponse,
} from "../../application/use-cases/login/login-boundaries.js";
import { ok } from "../http/http-responses.js";
import { BasePresenter } from "./base-presenter.js";
export class LoginPresenter
    extends BasePresenter
    implements ILoginOutputBoundary
{
    presentSuccess(response: ILoginResponse): void {
        this.respond(ok({ token: response.token, user: response.user }));
    }
}
