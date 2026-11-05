import type { ILocation } from "../../domain/entities/location.js";
import type { ILocationGateway } from "../../application/gateways/location-gateway.js";
import type { ILocationDataSource } from "../data-sources/location-data-source.js";
export class LocationGatewayImpl implements ILocationGateway {
    constructor(private readonly dataSource: ILocationDataSource) {}
    existsById(idLocation: number): Promise<boolean> {
        return this.dataSource.existsById(idLocation);
    }
    async findAll(): Promise<ILocation[]> {
        const records = await this.dataSource.findAll();
        return records.map((record) => ({ idLocation: record.id, name: record.name, address: record.address }));
    }
}
