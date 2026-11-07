import type {
    IRegisterUserInputBoundary,
} from "../../application/use-cases/register-user/register-user-boundaries.js";
import type {
    IHttpController,
    IHttpRequest,
    IHttpResponse,
} from "../http/http-types.js";
import { deletedSession, inactiveSession, invalidToken, validationError } from "../http/http-responses.js";
import type { SessionResolver } from "../http/session-resolver.js";
import { RegisterUserPresenter } from "../presenters/register-user-presenter.js";
import { registerSchema } from "../validators/auth-schemas.js";
export class RegisterUserController implements IHttpController {
    constructor(
        private readonly registerUser: IRegisterUserInputBoundary,
        private readonly sessions: SessionResolver,
    ) {}
    async handle(request: IHttpRequest): Promise<IHttpResponse> {
        // Esta ruta admite peticiones anónimas (auto-registro), pero no tokens falsos.
        const session = await this.sessions.resolve(request.authorizationHeader);
        if (session.kind === "invalid") return invalidToken();
        if (session.kind === "inactive") return inactiveSession();
        if (session.kind === "deleted") return deletedSession();
        const parsed = registerSchema.safeParse(request.body);
        if (!parsed.success) return validationError(parsed.error);
        const actorRole =
            session.kind === "authenticated" ? session.actor.role : null;
        const presenter = new RegisterUserPresenter();
        // El schema validó el cuerpo y su forma ya coincide con RegistrationData.
        await this.registerUser.execute(
            { actorRole, data: parsed.data },
            presenter,
        );
        return presenter.getViewModel();
    }
}
