import type { Request, RequestHandler } from "express";
import type { ITokenService } from "../../../application/ports/token-service.js";
import { InvalidTokenError } from "../../../domain/errors/domain-errors.js";

export function createOptionaAuthentication(tokens: ITokenService): RequestHandler{
    return (req, res, next)=>{
        const header = req.headers.authorization;

        if(header === undefined) {
            res.locals['sesion'] = null;
            next();
            return;
        }

        const [schema, token] = header.split(' ');
        if (schema !== 'Bearer' || !token) throw new InvalidTokenError();

        res.locals['sesion'] = tokens.verify(token);
        next();
    }
}