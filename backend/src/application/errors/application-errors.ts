//Algunos errores personalizados
import { extend } from "zod/mini";
import type { Role } from "../../domain/entities/role.js";
export abstract class ApplicationError extends Error {
    abstract readonly code: string;
    
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class InvalidCredentialsError extends ApplicationError{
    readonly code = 'INVALID_CREDENTIALS';
    constructor() {
        super('credenciales inválidas.');
    }
}

export class AmbiguousNameError extends ApplicationError{
    readonly code = 'AMBIGUOUS_NAME';
    constructor() {
        super('Existen varios usuarios con ese nombre. Inicia sesión con tu email.');
    }
}

export class InactiveUserError extends ApplicationError{
    readonly code = 'INACTIVE_USER';
    constructor() {
        super('La cuenta no está activa');
    }
}

export class InvalidTokenError extends ApplicationError {
    readonly code = 'INVALID_TOKEN';
    constructor() {
        super('El token proporcionado no es válido o ha expirado.');
    }
}

export class RegistrationNotAllowedError extends ApplicationError {
    readonly code = 'REGISTRATION_NOT_ALLOWED';
    constructor(actorRole: Role | null, objetive: Role) {
        super(
            actorRole === null
                ? 'Sin iniciar sesión solo es posible registrarse como cliente.'
                : `Un ${actorRole} no tiene permisos para registrar usuarios con rol ${objetive}.`
        );
    }
}

export class EmailAlreadyExistsError extends ApplicationError {
    readonly code = 'EMAIL_ALREADY_EXISTS';
    constructor() {
        super('Ya existe un usuario con ese email.');
    }
}

export class LocationNotFoundError extends ApplicationError {
    readonly code = 'LOCATION_NOT_FOUND';
    constructor(idLocation: number) {
        super(`La sede con el ID ${idLocation} no fue encontrada.`);
    }
}

export class UserNotFoundError extends ApplicationError{
    readonly code = 'USER_NOT_FOUND';

    constructor(id: number){
        super(`No existe el usuario con id ${id}`);
    }
}

export class UserAccessDeniedError extends ApplicationError{
    readonly code = 'USER_ACCESS_DENIED';

    constructor(actorRole: Role, targetRole: Role){
        super(`Un ${actorRole} no tiene permiso sobre un usuario con rol ${targetRole}`);
    }
}