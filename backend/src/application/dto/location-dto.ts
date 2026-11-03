import type { ILocation } from "../../domain/entities/location.js";
export interface ILocationDTO{
    readonly idLocation: number;
    readonly name: string;
}

// Conversion de la entidad al formato que envia hacia afuera
export function toLocationDto(location: ILocation): ILocationDTO{
    return {
        idLocation: location.idLocation,
        name: location.name
    };
}