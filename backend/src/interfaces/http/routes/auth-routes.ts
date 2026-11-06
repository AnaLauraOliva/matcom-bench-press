import { Router, type RequestHandler } from "express";
import type { AuthController } from "../controllers/auth-controllers.js";

export function createAuthRoutes(
    controller: AuthController,
    authenticationOptional: RequestHandler,
): Router{
    const router = Router();

    router.post('/login', controller.login);
    router.post('/register', authenticationOptional, controller.register);

    return router;
}