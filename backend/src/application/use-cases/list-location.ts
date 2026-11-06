import type { ILocationRepository } from "../../domain/repositories/location-repository.js";
import { toLocationDto, type ILocationDTO } from "../dto/location-dto.js";

export class ListLocations {
    constructor(
        private readonly locationRepository: ILocationRepository
    ) {}
    async execute(): Promise<ILocationDTO[]>{
        const locations = await this.locationRepository.findAll();
        return locations.map(toLocationDto);
    }
}