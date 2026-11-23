import type { ZodType } from "zod";
import type { IHttpController } from "./http-types.js";
import { loginSchema, registerSchema } from "../validators/auth-schemas.js";

export type ControllerName =
    | "login"
    | "registerUser"
    | "listLocations"
    | "getUser"
    | "deleteUser"
    | "deactivateUser";

export type ApiControllers = Readonly<Record<ControllerName, IHttpController>>;
export type ApiMethod = "get" | "post" | "patch" | "delete";

export interface ApiErrorDoc {
    readonly status: number;
    readonly code: string;
    readonly message: string;
    readonly description: string;
}

export interface ApiRouteDoc {
    readonly method: ApiMethod;
    /** Express path, used both to mount the endpoint and build the OpenAPI path. */
    readonly path: string;
    readonly controller: ControllerName;
    readonly summary: string;
    readonly description: string;
    readonly tag: string;
    readonly auth: "none" | "optional" | "required";
    readonly requestSchema?: ZodType;
    readonly success: {
        readonly status: number;
        readonly description: string;
        readonly schema?: unknown;
        readonly example?: unknown;
    };
    readonly errors: readonly ApiErrorDoc[];
}

const invalidData: ApiErrorDoc = {
    status: 400,
    code: "INVALID_DATA",
    message: "Los datos enviados no son válidos.",
    description: "El cuerpo o los parámetros no cumplen las reglas de validación. Incluye `details` con los campos afectados.",
};

const invalidToken: ApiErrorDoc = {
    status: 401,
    code: "INVALID_TOKEN",
    message: "El token es inválido o ha expirado.",
    description: "Se envió un encabezado Authorization que no contiene un token Bearer válido.",
};

const inactiveUser: ApiErrorDoc = {
    status: 403,
    code: "INACTIVE_USER",
    message: "La cuenta ya no está activa.",
    description: "La sesión pertenece a una cuenta desactivada.",
};

const userDeleted: ApiErrorDoc = {
    status: 404,
    code: "USER_DELETED",
    message: "El usuario solicitado fue eliminado.",
    description: "La sesión pertenece a una cuenta eliminada.",
};

const accessDenied: ApiErrorDoc = {
    status: 403,
    code: "USER_ACCESS_DENIED",
    message: "Un CLIENT no tiene permiso sobre un usuario con rol TRAINER.",
    description: "El mensaje real incluye los roles de la sesión y del usuario objetivo.",
};

const notFound: ApiErrorDoc = {
    status: 404,
    code: "USER_NOT_FOUND",
    message: "No existe el usuario con id 12.",
    description: "El mensaje real incluye el identificador solicitado.",
};

const locationNotFound: ApiErrorDoc = {
    status: 422,
    code: "LOCATION_NOT_FOUND",
    message: "La sede con el ID 99 no fue encontrada.",
    description: "El mensaje real incluye el identificador de sede. El `idLocation` del cliente debe corresponder a una sede existente.",
};

const commonErrors: readonly ApiErrorDoc[] = [
    {
        status: 400,
        code: "MALFORMED_JSON",
        message: "El cuerpo no es un JSON válido.",
        description: "El servidor no pudo interpretar el cuerpo JSON.",
    },
    {
        status: 500,
        code: "INTERNAL_ERROR",
        message: "Ocurrió un error inesperado.",
        description: "Fallo inesperado del servidor.",
    },
];

export const API_ROUTES: readonly ApiRouteDoc[] = [
    {
        method: "post",
        path: "/api/auth/login",
        controller: "login",
        summary: "Iniciar sesión",
        description: "Valida email y contraseña. Devuelve un JWT Bearer y los datos públicos de la cuenta activa.",
        tag: "Autenticación",
        auth: "none",
        requestSchema: loginSchema,
        success: {
            status: 200,
            description: "Sesión iniciada.",
            schema: { $ref: "#/components/schemas/LoginResponse" },
            example: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                    idUser: 12,
                    name: "Ana Pérez",
                    email: "ana@example.com",
                    phone: "+5355551234",
                    role: "CLIENT",
                    active: true,
                    registerDate: "2026-11-16T00:00:00.000Z",
                },
            },
        },
        errors: [
            invalidData,
            {
                status: 401,
                code: "INVALID_CREDENTIALS",
                message: "Las credenciales ingresadas son inválidas. Intente otra vez.",
                description: "El email no existe o la contraseña no coincide.",
            },
            {
                status: 403,
                code: "INACTIVE_USER",
                message: "La cuenta solicitada no está activa.",
                description: "Las credenciales son correctas, pero la cuenta está desactivada.",
            },
            ...commonErrors,
        ],
    },
    {
        method: "post",
        path: "/api/auth/register",
        controller: "registerUser",
        summary: "Registrar usuario",
        description: "Crea una cuenta según el rol. Sin sesión solo se permite registrar clientes; si se envía un token, debe ser válido y se aplican las reglas de registro por rol.",
        tag: "Autenticación",
        auth: "optional",
        requestSchema: registerSchema,
        success: {
            status: 201,
            description: "Usuario creado.",
            schema: { $ref: "#/components/schemas/UserResponse" },
            example: {
                user: {
                    idUser: 12,
                    name: "Ana Pérez",
                    email: "ana@example.com",
                    phone: "+5355551234",
                    role: "CLIENT",
                    active: true,
                    registerDate: "2026-11-16T00:00:00.000Z",
                },
            },
        },
        errors: [
            invalidData,
            invalidToken,
            inactiveUser,
            userDeleted,
            {
                status: 403,
                code: "REGISTRATION_NOT_ALLOWED",
                message: "Sin iniciar sesión solo es posible registrarse como cliente.",
                description: "El mensaje real depende de si el actor está autenticado y de los roles involucrados.",
            },
            {
                status: 409,
                code: "EMAIL_ALREADY_EXISTS",
                message: "Ya existe un usuario registrado con ese email.",
                description: "El email ya está asociado a una cuenta.",
            },
            {
                status: 409,
                code: "PHONE_ALREADY_EXISTS",
                message: "Ya existe un usuario registrado con ese número telefónico.",
                description: "El teléfono ya está asociado a una cuenta.",
            },
            locationNotFound,
            ...commonErrors,
        ],
    },
    {
        method: "get",
        path: "/api/locations",
        controller: "listLocations",
        summary: "Listar sedes",
        description: "Devuelve las sedes disponibles para asociar clientes. No requiere autenticación.",
        tag: "Sedes",
        auth: "none",
        success: {
            status: 200,
            description: "Lista de sedes.",
            schema: { $ref: "#/components/schemas/LocationsResponse" },
            example: {
                locations: [
                    { idLocation: 1, name: "Sede Central" },
                    { idLocation: 2, name: "Sede Norte" },
                ],
            },
        },
        errors: commonErrors,
    },
    {
        method: "get",
        path: "/api/users/:id",
        controller: "getUser",
        summary: "Obtener usuario",
        description: "Obtiene el perfil detallado del usuario. El actor puede consultar su propio perfil y los perfiles autorizados por su rol.",
        tag: "Usuarios",
        auth: "required",
        success: {
            status: 200,
            description: "Perfil encontrado.",
            schema: { $ref: "#/components/schemas/UserDetailsResponse" },
            example: {
                user: {
                    idUser: 12,
                    name: "Ana Pérez",
                    email: "ana@example.com",
                    phone: "+5355551234",
                    role: "CLIENT",
                    active: true,
                    registerDate: "2026-11-16T00:00:00.000Z",
                    age: 28,
                    gender: "FEMENINO",
                    location: { idLocation: 1, name: "Sede Central" },
                },
            },
        },
        errors: [
            invalidData,
            {
                status: 401,
                code: "AUTHENTICATION_REQUIRED",
                message: "Debes iniciar sesión.",
                description: "Falta el encabezado Authorization.",
            },
            invalidToken,
            inactiveUser,
            userDeleted,
            accessDenied,
            notFound,
            ...commonErrors,
        ],
    },
    {
        method: "delete",
        path: "/api/users/:id",
        controller: "deleteUser",
        summary: "Eliminar usuario",
        description: "Realiza el borrado lógico del usuario: conserva su identificador para las relaciones, anonimiza los datos personales y bloquea su sesión. Se conserva siempre al menos un administrador activo.",
        tag: "Usuarios",
        auth: "required",
        success: {
            status: 204,
            description: "Usuario eliminado. La respuesta no tiene cuerpo.",
        },
        errors: [
            invalidData,
            {
                status: 401,
                code: "AUTHENTICATION_REQUIRED",
                message: "Debes iniciar sesión.",
                description: "Falta el encabezado Authorization.",
            },
            invalidToken,
            inactiveUser,
            userDeleted,
            accessDenied,
            notFound,
            {
                status: 409,
                code: "LAST_ADMIN",
                message: "No se puede realizar la operación porque debe existir al menos un administrador activo.",
                description: "La operación dejaría el sistema sin administradores activos.",
            },
            ...commonErrors,
        ],
    },
    {
        method: "patch",
        path: "/api/users/:id/deactivate",
        controller: "deactivateUser",
        summary: "Desactivar usuario",
        description: "Desactiva la cuenta sin anonimizar ni eliminar sus datos. La cuenta ya no puede iniciar sesión; se conserva siempre al menos un administrador activo.",
        tag: "Usuarios",
        auth: "required",
        success: {
            status: 204,
            description: "Usuario desactivado. La respuesta no tiene cuerpo.",
        },
        errors: [
            invalidData,
            {
                status: 401,
                code: "AUTHENTICATION_REQUIRED",
                message: "Debes iniciar sesión.",
                description: "Falta el encabezado Authorization.",
            },
            invalidToken,
            inactiveUser,
            userDeleted,
            accessDenied,
            notFound,
            {
                status: 409,
                code: "LAST_ADMIN",
                message: "No se puede realizar la operación porque debe existir al menos un administrador activo.",
                description: "La operación dejaría el sistema sin administradores activos.",
            },
            ...commonErrors,
        ],
    },
];

