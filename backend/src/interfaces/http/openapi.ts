import { z } from "zod";
import { GENDERS } from "../../domain/entities/gender.js";
import { ROLES } from "../../domain/entities/role.js";
import { API_ROUTES, type ApiErrorDoc, type ApiRouteDoc } from "./api-routes.js";

const jsonSchema = (schema: ApiRouteDoc["requestSchema"]): unknown => {
    if (!schema) return undefined;
    const { $schema: _schemaDialect, ...bodySchema } = z.toJSONSchema(schema, {
        io: "input",
    });
    return bodySchema;
};

function toOpenApiPath(expressPath: string): string {
    return expressPath.replace(/:([A-Za-z0-9_]+)/g, "{$1}");
}

function errorExample(error: ApiErrorDoc): { error: Record<string, unknown> } {
    return {
        error: {
            code: error.code,
            message: error.message,
            ...(error.code === "INVALID_DATA"
                ? {
                      details: [
                          {
                              field: "email",
                              message: "Email inválido",
                          },
                      ],
                  }
                : {}),
        },
    };
}

function makeResponses(route: ApiRouteDoc): Record<string, unknown> {
    const success: Record<string, unknown> = {
        description: route.success.description,
    };
    if (route.success.schema !== undefined) {
        success.content = {
            "application/json": {
                schema: route.success.schema,
                ...(route.success.example === undefined
                    ? {}
                    : { example: route.success.example }),
            },
        };
    }

    const responses: Record<string, unknown> = {
        [route.success.status]: success,
    };
    const errorsByStatus = new Map<number, ApiErrorDoc[]>();
    for (const error of route.errors) {
        const group = errorsByStatus.get(error.status) ?? [];
        group.push(error);
        errorsByStatus.set(error.status, group);
    }

    for (const [status, errors] of errorsByStatus) {
        responses[status] = {
            description: errors.map((error) => error.description).join(" "),
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/ErrorResponse" },
                    examples: Object.fromEntries(
                        errors.map((error) => [
                            error.code,
                            {
                                summary: `${error.code}: ${error.message}`,
                                value: errorExample(error),
                            },
                        ]),
                    ),
                },
            },
        };
    }

    return responses;
}

function makeOperation(route: ApiRouteDoc): Record<string, unknown> {
    const operation: Record<string, unknown> = {
        tags: [route.tag],
        summary: route.summary,
        description: route.description,
        operationId: `${route.method}_${route.path
            .replace(/^\/api\//, "")
            .replace(/:[A-Za-z0-9_]+/g, "by_id")
            .replace(/[^A-Za-z0-9]+/g, "_")
            .replace(/^_|_$/g, "")}`,
        responses: makeResponses(route),
    };

    const pathParameters = [...route.path.matchAll(/:([A-Za-z0-9_]+)/g)].map(
        ([, name]) => ({
            name,
            in: "path",
            required: true,
            description: "Identificador entero positivo del usuario.",
            schema: { type: "integer", minimum: 1 },
            example: 12,
        }),
    );
    if (pathParameters.length > 0) operation.parameters = pathParameters;

    if (route.auth === "required") operation.security = [{ bearerAuth: [] }];
    if (route.auth === "optional") {
        operation.parameters = [
            ...pathParameters,
            {
                name: "Authorization",
                in: "header",
                required: false,
                description:
                    "Opcional para el auto-registro de clientes. Si se envía, debe tener el formato `Bearer <token>` y pertenecer a una sesión activa.",
                schema: { type: "string", example: "Bearer eyJhbGciOi..." },
            },
        ];
    }

    const requestSchema = jsonSchema(route.requestSchema);
    if (requestSchema !== undefined) {
        operation.requestBody = {
            required: true,
            content: {
                "application/json": { schema: requestSchema },
            },
        };
    }

    return operation;
}

export const openApiDocument = {
    openapi: "3.1.0",
    info: {
        title: "MatCom Bench Press API",
        version: "1.0.0",
        description:
            "Contrato generado desde las rutas registradas en Express y los esquemas Zod de entrada. Los ejemplos y errores describen el comportamiento implementado por los controladores y casos de uso.",
    },
    servers: [{ url: "/", description: "Servidor actual" }],
    tags: [
        { name: "Autenticación", description: "Inicio de sesión y registro." },
        { name: "Sedes", description: "Sedes disponibles para los clientes." },
        { name: "Usuarios", description: "Consulta, desactivación y eliminación de usuarios." },
    ],
    paths: API_ROUTES.reduce<Record<string, Record<string, unknown>>>(
        (paths, route) => {
            const path = toOpenApiPath(route.path);
            const pathItem = paths[path] ?? {};
            pathItem[route.method] = makeOperation(route);
            paths[path] = pathItem;
            return paths;
        },
        {},
    ),
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description:
                    "Usa el JWT devuelto por `POST /api/auth/login` como `Authorization: Bearer <token>`.",
            },
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                required: ["error"],
                properties: {
                    error: {
                        type: "object",
                        required: ["code", "message"],
                        properties: {
                            code: { type: "string" },
                            message: { type: "string" },
                            details: {
                                type: "array",
                                items: {
                                    type: "object",
                                    required: ["field", "message"],
                                    properties: {
                                        field: { type: "string" },
                                        message: { type: "string" },
                                    },
                                },
                                description:
                                    "Presente en INVALID_DATA con los errores de validación.",
                            },
                        },
                    },
                },
            },
            Role: { type: "string", enum: ROLES },
            Gender: { type: "string", enum: GENDERS },
            Location: {
                type: "object",
                required: ["idLocation", "name"],
                properties: {
                    idLocation: { type: "integer", minimum: 1 },
                    name: { type: "string" },
                },
            },
            UserSummary: {
                type: "object",
                required: [
                    "idUser",
                    "name",
                    "email",
                    "phone",
                    "role",
                    "active",
                    "registerDate",
                ],
                properties: {
                    idUser: { type: "integer", minimum: 1 },
                    name: { type: "string" },
                    email: { type: "string", format: "email" },
                    phone: { type: "string" },
                    role: { $ref: "#/components/schemas/Role" },
                    active: { type: "boolean" },
                    registerDate: {
                        type: "string",
                        format: "date-time",
                        description: "Fecha serializada como ISO 8601.",
                    },
                },
            },
            UserResponse: {
                type: "object",
                required: ["user"],
                properties: {
                    user: { $ref: "#/components/schemas/UserSummary" },
                },
            },
            LoginResponse: {
                type: "object",
                required: ["token", "user"],
                properties: {
                    token: { type: "string", description: "JWT de sesión." },
                    user: { $ref: "#/components/schemas/UserSummary" },
                },
            },
            LocationsResponse: {
                type: "object",
                required: ["locations"],
                properties: {
                    locations: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Location" },
                    },
                },
            },
            UserDetailsResponse: {
                type: "object",
                required: ["user"],
                properties: {
                    user: {
                        oneOf: [
                            { $ref: "#/components/schemas/AdminDetails" },
                            { $ref: "#/components/schemas/TrainerDetails" },
                            { $ref: "#/components/schemas/ClientDetails" },
                        ],
                        discriminator: { propertyName: "role" },
                    },
                },
            },
            AdminDetails: {
                allOf: [
                    { $ref: "#/components/schemas/UserSummary" },
                    {
                        type: "object",
                        properties: { role: { const: "ADMIN" } },
                    },
                ],
            },
            TrainerDetails: {
                allOf: [
                    { $ref: "#/components/schemas/UserSummary" },
                    {
                        type: "object",
                        required: ["specialty"],
                        properties: {
                            role: { enum: ["TRAINER", "HEAD_TRAINER"] },
                            specialty: { type: "string" },
                        },
                    },
                ],
            },
            ClientDetails: {
                allOf: [
                    { $ref: "#/components/schemas/UserSummary" },
                    {
                        type: "object",
                        required: ["age", "gender", "location"],
                        properties: {
                            role: { const: "CLIENT" },
                            age: { type: "integer", minimum: 1, maximum: 120 },
                            gender: { $ref: "#/components/schemas/Gender" },
                            location: { $ref: "#/components/schemas/Location" },
                        },
                    },
                ],
            },
        },
    },
} as const;

