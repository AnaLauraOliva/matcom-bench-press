import type {
    IRegisterUserOutputBoundary,
    IRegisterUserResponse,
} from "../../application/use-cases/register-user/register-user-boundaries.js";
import { created } from "../http/http-responses.js";
import { BasePresenter } from "./base-presenter.js";
export class RegisterUserPresenter
    extends BasePresenter
    implements IRegisterUserOutputBoundary
{
    presentSuccess(response: IRegisterUserResponse): void {
        this.respond(created({ user: response.user }));
    }
}
