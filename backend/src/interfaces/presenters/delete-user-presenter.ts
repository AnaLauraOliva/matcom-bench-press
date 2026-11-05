import type { IDeleteUserOutputBoundary } from "../../application/use-cases/delete-user/delete-user-boundaries.js";
import { noContent } from "../http/http-responses.js";
import { BasePresenter } from "./base-presenter.js";
export class DeleteUserPresenter
    extends BasePresenter
    implements IDeleteUserOutputBoundary
{
    presentSuccess(): void {
        this.respond(noContent());
    }
}
