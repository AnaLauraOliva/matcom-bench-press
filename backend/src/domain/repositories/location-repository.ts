import { ILocation } from "../entities/location.js";

export interface ILocationRepository {
    // Contrato para preguntar si una sede existe (Se implementa en caso de uso)
    exists(idLocation: number): Promise<boolean>;
    // Contrato para pedir el listado de todas las sedes (Se implementa en caso de uso)
    findAll(): Promise<ILocation[]>;
}