import type { ITargetUserRequest } from "../../application/models/target-user-request.js";
import type {
    IHttpController,
    IHttpRequest,
    IHttpResponse,
} from "../http/http-types.js";
import {
    authenticationRequired,
    invalidToken,
    validationError,
} from "../http/http-responses.js";
import type { SessionResolver } from "../http/session-resolver.js";
import { userIdParamsSchema } from "../validators/user-schemas.js";
// Base común de las acciones sobre un usuario concreto: exige sesión y valida el id de la ruta.
// Cada controlador hijo solo define qué caso de uso ejecuta (método "run").
export abstract class TargetUserController implements IHttpController {
    constructor(private readonly sessions: SessionResolver) {}
    async handle(request: IHttpRequest): Promise<IHttpResponse> {
        const session = this.sessions.resolve(request.authorizationHeader);
        if (session.kind === "anonymous") return authenticationRequired();
        if (session.kind === "invalid") return invalidToken();
        const params = userIdParamsSchema.safeParse(request.params);
        if (!params.success) return validationError(params.error);
        return this.run({ actor: session.actor, targetUserId: params.data.id });
    }
    protected abstract run(request: ITargetUserRequest): Promise<IHttpResponse>;
}
