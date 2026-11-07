import { ILocation } from "../../domain/entities/location.js";
// Contrato de acceso a las sedes
export interface ILocationGateway {
    existsById(idLocation: number): Promise<boolean>;
    findAll(): Promise<ILocation[]>;
}