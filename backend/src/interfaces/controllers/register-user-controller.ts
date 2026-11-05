import type {
    IRegisterUserInputBoundary,
    RegistrationData,
} from "../../application/use-cases/register-user/register-user-boundaries.js";
import type {
    IHttpController,
    IHttpRequest,
    IHttpResponse,
} from "../http/http-types.js";
import { invalidToken, validationError } from "../http/http-responses.js";
import type { SessionResolver } from "../http/session-resolver.js";
import { RegisterUserPresenter } from "../presenters/register-user-presenter.js";
import {
    registerSchema,
    type RegisterBody,
} from "../validators/auth-schemas.js";
export class RegisterUserController implements IHttpController {
    constructor(
        private readonly registerUser: IRegisterUserInputBoundary,
        private readonly sessions: SessionResolver,
    ) {}
    async handle(request: IHttpRequest): Promise<IHttpResponse> {
        // Esta ruta admite peticiones anónimas (auto-registro), pero no tokens falsos.
        const session = this.sessions.resolve(request.authorizationHeader);
        if (session.kind === "invalid") return invalidToken();
        const parsed = registerSchema.safeParse(request.body);
        if (!parsed.success) return validationError(parsed.error);
        const actorRole =
            session.kind === "authenticated" ? session.actor.role : null;
        const presenter = new RegisterUserPresenter();
        await this.registerUser.execute(
            { actorRole, data: this.toRegistrationData(parsed.data) },
            presenter,
        );
        return presenter.getViewModel();
    }
    private toRegistrationData(body: RegisterBody): RegistrationData {
        if (body.role === "CLIENT") {
            const { idLocation, ...rest } = body;
            return { ...rest, idLocation: idLocation };
        }
        return body;
    }
}
