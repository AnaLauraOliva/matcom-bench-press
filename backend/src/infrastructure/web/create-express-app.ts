import express, { type ErrorRequestHandler, type Express } from "express";
import { errorResponse } from "../../interfaces/http/http-responses.js";
import type { IHttpController } from "../../interfaces/http/http-types.js";
import { sendHttpResponse, toExpressHandler } from "./express-route-handler.js";
import cors from 'cors';
import { env } from "../../config/env.js";
export interface Controllers {
    readonly login: IHttpController;
    readonly registerUser: IHttpController;
    readonly listLocations: IHttpController;
    readonly getUser: IHttpController;
    readonly deleteUser: IHttpController;
    readonly deactivateUser: IHttpController;
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
    app.post("/api/auth/login", toExpressHandler(controllers.login));
    app.post("/api/auth/register", toExpressHandler(controllers.registerUser));
    app.get("/api/locations", toExpressHandler(controllers.listLocations));
    app.get("/api/users/:id", toExpressHandler(controllers.getUser));
    app.delete("/api/users/:id", toExpressHandler(controllers.deleteUser)); // borrado real
    app.patch(
        "/api/users/:id/deactivate",
        toExpressHandler(controllers.deactivateUser),
    ); // borrado lógico
    app.use((_req, res) => {
        sendHttpResponse(
            res,
            errorResponse(404, "ROUTE_NOT_FOUND", "La ruta no existe."),
        );
    });
    app.use(handleUnexpectedErrors); // siempre el último
    return app;
}
