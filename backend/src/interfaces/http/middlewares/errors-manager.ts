import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { DomainError } from "../../../domain/errors/domain-errors.js";

const STATE_BY_CODE: Readonly<Record<string, number>> = {
    INVALID_CREDENTIALS: 401,
    AMBIGUOUS_NAME: 409,
    INACTIVE_USER: 403,
    INVALID_TOKEN: 401,
    PERMISSION_DENIED: 403,
    EMAIL_ALREADY_EXISTS: 409,
    LOCATION_NOT_FOUND: 422
}

export const errorsManager: ErrorRequestHandler = (error, _req, res, _next) =>{
    if (error instanceof ZodError) {
        res.status(400).json({
            error: {
                code: 'INVALID_DATA',
                message: 'Los datos enviados no son válidos.',
                details: error.issues.map((problem)=>({
                    field: problem.path.join('.'),
                    message: problem.message,
                })),
            },
        });
        return;
    }

    if (error instanceof DomainError) {
        res.status(STATE_BY_CODE[error.code] ?? 400).json({
            error: {code: error.code, message: error.message},
        });
        return;
    }

    console.error(error);
    res.status(500).json({
        error: {code: 'INTERNAL_ERROR', message: 'Ocurrió un error inesperado.'},
    });
};