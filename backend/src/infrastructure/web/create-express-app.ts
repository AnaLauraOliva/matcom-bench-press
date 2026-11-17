import express, { type ErrorRequestHandler, type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { errorResponse } from "../../interfaces/http/http-responses.js";
import type { IHttpController } from "../../interfaces/http/http-types.js";
import { API_ROUTES, type ApiControllers, type ApiRouteDoc } from "../../interfaces/http/api-routes.js";
import { openApiDocument } from "../../interfaces/http/openapi.js";
import { sendHttpResponse, toExpressHandler } from "./express-route-handler.js";
import cors from 'cors';
import { env } from "../../config/env.js";
export type Controllers = ApiControllers;

function mountApiRoute(
    app: Express,
    route: ApiRouteDoc,
    controller: IHttpController,
): void {
    const handler = toExpressHandler(controller);
    switch (route.method) {
        case "get":
            app.get(route.path, handler);
            break;
        case "post":
            app.post(route.path, handler);
            break;
        case "patch":
            app.patch(route.path, handler);
            break;
        case "delete":
            app.delete(route.path, handler);
            break;
    }
}
// Errores que no son de negocio: JSON mal formado y fallos inesperados.
const handleUnexpectedErrors: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
) => {
    if (error instanceof SyntaxError && "body" in error) {
        sendHttpResponse(
            res,
            errorResponse(
                400,
                "MALFORMED_JSON",
                "El cuerpo no es un JSON válido.",
            ),
        );
        return;
    }
    // Fallo inesperado: se registra y no se revelan detalles hacia afuera.
    console.error(error);
    sendHttpResponse(
        res,
        errorResponse(500, "INTERNAL_ERROR", "Ocurrió un error inesperado."),
    );
};
export function createExpressApp(controllers: Controllers): Express {
    const app = express();
    app.use(cors({
        origin: env.FRONTEND_ORIGIN,
        credentials: true,
    }));
    app.use(express.json());
    for (const route of API_ROUTES) {
        mountApiRoute(app, route, controllers[route.controller]);
    }
    app.get("/openapi.json", (_req, res) => res.json(openApiDocument));
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(openApiDocument, {
            customSiteTitle: "Bench Press API · Documentación",
        }),
    );
    app.use((_req, res) => {
        sendHttpResponse(
            res,
            errorResponse(404, "ROUTE_NOT_FOUND", "La ruta no existe."),
        );
    });
    app.use(handleUnexpectedErrors); // siempre el último
    return app;
}
