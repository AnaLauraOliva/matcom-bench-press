import type { Request, Response } from 'express';
import type { Identificator, Login } from '../../../application/use-cases/login.js';
import type { RegisterUser } from '../../../application/use-cases/register.js';
import type { IPayloadToken } from '../../../application/ports/token-service.js';
import { loginSchema, registerScheme } from '../validators/auth-schemas.js';
import { Payload } from '@prisma/client/runtime/client';
export class AuthController {
    constructor(
        private readonly loginProperty: Login,
        private readonly registerUserProperty: RegisterUser,
    ) {}

    login = async (req: Request, res: Response): Promise<void>=>{
        const data = loginSchema.parse(req.body);
        const identificator: Identificator = data.email !== undefined ? {email: data.email} : {name: data.name!};
        const result = await this.loginProperty.execute({
            identificator,
            password: data.password,
        });
        res.status(200).json(result);
    }
    register = async(req: Request, res:Response): Promise<void> => {
        const data = registerScheme.parse(req.body);

        const sesion = res.locals['sesion'] as IPayloadToken | null;
        const actor = sesion?.role ?? null;

        const user = await this.registerUserProperty.execute({actor,data});
        res.status(201).json({user});
    }
}