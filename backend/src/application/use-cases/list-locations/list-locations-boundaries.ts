import type { ILocationResponse } from "../../models/location-response.js";

export interface IListLocationsResponse {
    readonly locations: readonly ILocationResponse[];
}

export interface IListLocationsInputBoundary {
    execute(output: IListLocationsOutputBoundary): Promise<void>;
}

export interface IListLocationsOutputBoundary {
    presentSuccess(response: IListLocationsResponse): void;
}