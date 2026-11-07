import type {
    LoginIdentifier,
    ILoginInputBoundary,
} from "../../application/use-cases/login/login-boundaries.js";
import type {
    IHttpController,
    IHttpRequest,
    IHttpResponse,
} from "../http/http-types.js";
import { validationError } from "../http/http-responses.js";
import { LoginPresenter } from "../presenters/login-presenter.js";
import { loginSchema } from "../validators/auth-schemas.js";
export class LoginController implements IHttpController {
    constructor(private readonly login: ILoginInputBoundary) {}
    async handle(request: IHttpRequest): Promise<IHttpResponse> {
        const parsed = loginSchema.safeParse(request.body);
        if (!parsed.success) return validationError(parsed.error);
        const { email, name, password } = parsed.data;
        // El esquema garantiza que existe al menos uno; si llegan ambos, manda el email.
        const identifier: LoginIdentifier =
            email !== undefined ? { email } : { name: name! };
        // Un presenter nuevo por petición: así peticiones simultáneas no se mezclan.
        const presenter = new LoginPresenter();
        await this.login.execute({ identifier, password }, presenter);
        return presenter.getViewModel();
    }
}
