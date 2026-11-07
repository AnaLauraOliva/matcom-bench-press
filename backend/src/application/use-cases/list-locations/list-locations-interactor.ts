import type { ILocationGateway } from "../../gateways/location-gateway.js";
import { toLocationResponse } from "../../models/location-response.js";
import type { IListLocationsInputBoundary,IListLocationsOutputBoundary } from "./list-locations-boundaries.js";

export class ListLocationsInteractor implements IListLocationsInputBoundary{
    constructor(
        private readonly locations: ILocationGateway
    ){}

    async execute(output: IListLocationsOutputBoundary): Promise<void> {
        const locations = await this.locations.findAll();
        output.presentSuccess({locations: locations.map(toLocationResponse)});
    }
}