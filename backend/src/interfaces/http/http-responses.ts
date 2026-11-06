import { ZodError } from "zod";
import { UserDeletedError } from "../../application/errors/application-errors.js";
import type { ApplicationError } from "../../application/errors/application-errors.js";
import type { IHttpResponse } from "./http-types.js";

const STATUS_BY_ERROR_CODE: Readonly<Record<string, number>> = {
    INVALID_CREDENTIALS: 401,
    INACTIVE_USER: 403,
    REGISTRATION_NOT_ALLOWED: 403,
    USER_ACCESS_DENIED: 403,
    USER_NOT_FOUND: 404,
    USER_DELETED: 404,
    AMBIGUOUS_NAME: 409,
    LAST_ADMIN: 409,
    EMAIL_ALREADY_EXISTS: 409,
    PHONE_ALREADY_EXISTS: 409,
    LOCATION_NOT_FOUND: 422,
};

/*
 * Información de los códigos usados:
 * 401 es Unauthorized indica que la petición del cliente no puede completarse por credenciales de autenticación inválidas;
 * 403 es Forbidden significa que el server entiende la petición pero no puede autorizarla;
 * 404 es Not Found, indica que el server no puede encontrar el recurso solicitado
 * 409 es Conflict indica un conflicto entre la solicitud y el estado actual del recurso de destino
 * 422 es Unprocessable Entity: el server entiende el tipo de contenido de la entidad de la solicitud, y que la sintaxis de dicha entidad es correcta, pero que no ha podido procesar las instrucciones que contiene
 * fuente https://http.cat
 */
export function errorResponse(
    status: number,
    code: string,
    message: string,
    details?: unknown,
): IHttpResponse {
    return {
        status,
        body: {
            error: {
                code,
                message,
                ...(details === undefined ? {} : { details }),
            },
        },
    };
}
export function fromApplicationError(error: ApplicationError): IHttpResponse {
    return errorResponse(
        STATUS_BY_ERROR_CODE[error.code] ?? 400,
        error.code,
        error.message,
    );
}
export function validationError(error: ZodError): IHttpResponse {
    const details = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
    }));
    return errorResponse(
        400,
        "INVALID_DATA",
        "Los datos enviados no son válidos.",
        details,
    );
}
export function authenticationRequired(): IHttpResponse {
    return errorResponse(
        401,
        "AUTHENTICATION_REQUIRED",
        "Debes iniciar sesión.",
    );
}
export function invalidToken(): IHttpResponse {
    return errorResponse(
        401,
        "INVALID_TOKEN",
        "El token es inválido o ha expirado.",
    );
}
// La sesión existe pero el dueño del token ya no está activo
// (fue desactivado o borrado después de iniciar sesión).
export function inactiveSession(): IHttpResponse {
    return errorResponse(403, "INACTIVE_USER", "La cuenta ya no está activa.");
}
// La sesión existe pero el dueño del token fue ELIMINADO (borrado suave).
export function deletedSession(): IHttpResponse {
    return fromApplicationError(new UserDeletedError());
}
export const ok = (body: unknown): IHttpResponse => ({ status: 200, body });
export const created = (body: unknown): IHttpResponse => ({
    status: 201,
    body,
});
export const noContent = (): IHttpResponse => ({ status: 204 });

/*
 * 200 es OK: la solicitud se ha realizado correctamente
 * 201 es Created: la solicitud se ha realizado correctamente y ha dado lugar a la creación de un recurso
 * 204 es No Content: una solicitud se ha realizado correctamente, pero que el cliente no necesita abandonar la página actual
 */
