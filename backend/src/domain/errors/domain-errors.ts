//Algunos errores personalizados
import { extend } from "zod/mini";
import type { Role } from "../entities/role.js";
export abstract class DomainError extends Error {
    abstract readonly code: string;
    
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class InvalidCredentialsError extends DomainError{
    readonly code = 'INVALID_CREDENTIALS';
    constructor() {
        super('credenciales inválidas.');
    }
}

export class AmbiguousNameError extends DomainError{
    readonly code = 'AMBIGUOUS_NAME';
    constructor() {
        super('Existen varios usuarios con ese nombre. Inicia sesión con tu email.');
    }
}

export class InactiveUserError extends DomainError{
    readonly code = 'INACTIVE_USER';
    constructor() {
        super('La cuenta no está activa');
    }
}

export class InvalidTokenError extends DomainError {
    readonly code = 'INVALID_TOKEN';
    constructor() {
        super('El token proporcionado no es válido o ha expirado.');
    }
}

export class PermissionDeniedError extends DomainError {
    readonly code = 'PERMISSION_DENIED';
    constructor(actor: Role | null, objetive: Role) {
        super(
            actor === null
                ? 'Sin iniciar sesión solo es posible registrarse como cliente.'
                : `Un ${actor} no tiene permisos para registrar usuarios con rol ${objetive}.`
        );
    }
}

export class EmailAlreadyExistsError extends DomainError {
    readonly code = 'EMAIL_ALREADY_EXISTS';
    constructor() {
        super('Ya existe un usuario con ese email.');
    }
}

export class LocationNotFoundError extends DomainError {
    readonly code = 'LOCATION_NOT_FOUND';
    constructor(idLocation: number) {
        super(`La sede con el ID ${idLocation} no fue encontrada.`);
    }
}

export class UserNotFoundError extends DomainError{
    readonly code = 'USER_NOT_FOUND';

    constructor(id: number){
        super(`No existe el usuario con id ${id}`);
    }
}

export class UserAccessDeniedError extends DomainError{
    readonly code = 'USER_ACCESS_DENIED';

    constructor(actorRole: Role, targetRole: Role){
        super(`Un ${actorRole} no tiene permiso sobre un usuario con rol ${targetRole}`);
    }
}