import type { Request, Response } from "express";
import type { ListLocations } from "../../../application/use-cases/list-location.js";

export class LocationController{
    constructor(
        private readonly listLocation: ListLocations
    ) {}

    list = async (_req: Request, res: Response): Promise<void> => {
        const locations = await this.listLocation.execute();
        res.status(200).json({locations});
    };
}