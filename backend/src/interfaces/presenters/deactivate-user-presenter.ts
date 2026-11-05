import type { IDeactivateUserOutputBoundary } from "../../application/use-cases/deactivate-user/deactivate-user-boundaries.js";
import { noContent } from "../http/http-responses.js";
import { BasePresenter } from "./base-presenter.js";
export class DeactivateUserPresenter
    extends BasePresenter
    implements IDeactivateUserOutputBoundary
{
    presentSuccess(): void {
        this.respond(noContent());
    }
}
