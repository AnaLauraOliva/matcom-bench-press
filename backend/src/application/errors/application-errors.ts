//Algunos errores personalizados
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
        super('Las credenciales ingresadas son inválidas. Intente otra vez.');
    }
}

export class AmbiguousNameError extends ApplicationError{
    readonly code = 'AMBIGUOUS_NAME';
    constructor() {
        super('Existen varios usuarios con ese nombre. Inicie sesión con su email.');
    }
}

export class InactiveUserError extends ApplicationError{
    readonly code = 'INACTIVE_USER';
    constructor() {
        super('La cuenta solicitada no está activa');
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
        super('Ya existe un usuario registrado con ese email.');
    }
}

export class PhoneAlreadyExistsError extends ApplicationError {
    readonly code = 'PHONE_ALREADY_EXISTS';
    constructor() {
        super('Ya existe un usuario registrado con ese número telefónico.');
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

// Contraste con InactiveUserError: este indica que el usuario no solo fue
// desactivado, sino eliminado (borrado suave).
export class UserDeletedError extends ApplicationError {
    readonly code = 'USER_DELETED';

    constructor() {
        super('El usuario solicitado fue eliminado.');
    }
}

// Regla "siempre debe existir al menos un administrador activo en la base de datos".
export class LastAdminError extends ApplicationError {
    readonly code = 'LAST_ADMIN';

    constructor() {
        super('No se puede realizar la operación porque debe existir al menos un administrador activo.');
    }
}