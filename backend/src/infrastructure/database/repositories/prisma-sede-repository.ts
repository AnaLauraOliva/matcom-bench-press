import type { PrismaClient } from "../prisma-client.js";
import type { ILocationRepository } from "../../../domain/repositories/location-repository.js";

export class PrismaLocationRepository implements ILocationRepository {
    constructor(private readonly prisma: PrismaClient) {}
    
    async exists(locationName: string): Promise<boolean> {
        const location = await this.prisma.location.findUnique({
            where: { name: locationName }
        });
        return location !== null;
    }
}