import { Router } from "express";
import type { LocationController } from "../controllers/location-controller.js";

export function createLocationRoutes(controller: LocationController): Router {
    const router = Router();

    router.get('/', controller.list);

    return router;
}