import express, { type Express } from 'express';
import type { ITokenService } from '../../application/ports/token-service.js';
import type { Login } from '../../application/use-cases/login.js';
import type { RegisterUser } from '../../application/use-cases/register.js';
import { AuthController } from './controllers/auth-controllers.js';
import { errorsManager } from './middlewares/errors-manager.js';
import { createAuthRoutes } from './routes/auth-routes.js';
import { createOptionaAuthentication } from './middlewares/auth-optional.js';
import cors from 'cors';
import { env } from '../../config/env.js'

export interface IHttpDependencies {
    readonly login: Login;
    readonly registerUser: RegisterUser;
    readonly tokens: ITokenService;
}

export function createApp (dependencies: IHttpDependencies): Express {
    const app = express();


    app.use(cors({
        origin: env.FRONTEND_ORIGIN,
        credentials: true,
    }));
    app.use(express.json());
    const controller = new AuthController(
        dependencies.login,
        dependencies.registerUser,
    );
    const optionalAuthentication = createOptionaAuthentication(dependencies.tokens);
    app.use('/api/auth', createAuthRoutes(controller, optionalAuthentication));

    app.use((_req, res) => {
        res.status(404).json({
            error: {code: 'ROUTE_NOT_FOUND', message: 'La ruta no existe'},
        });
    });

    app.use(errorsManager);

    return app;
}