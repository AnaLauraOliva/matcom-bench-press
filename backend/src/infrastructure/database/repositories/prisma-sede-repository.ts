import type { PrismaClient } from "../prisma-client.js";
import type { ILocationRepository } from "../../../domain/repositories/location-repository.js";

export class PrismaLocationRepository implements ILocationRepository {
    constructor(private readonly prisma: PrismaClient) {}
    
    async exists(idLocation: number): Promise<boolean> {
        const total = await this.prisma.location.count({where: {idLocation: idLocation}})
        return total > 0;
    }
}