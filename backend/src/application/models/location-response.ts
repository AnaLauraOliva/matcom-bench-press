import type { ILocation } from "../../domain/entities/location.js";

export interface ILocationResponse {
    readonly idLocation: number;
    readonly name: string;
}

export function toLocationResponse(location: ILocation): ILocationResponse{
    return{
        idLocation: location.idLocation,
        name: location.name
    }
}