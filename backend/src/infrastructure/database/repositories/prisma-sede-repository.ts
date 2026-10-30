import type { PrismaClient } from "../prisma-client.js";
import type { ILocationRepository } from "../../../domain/repositories/location-repository.js";
import type { ILocation } from "../../../domain/entities/location.js";
export class PrismaLocationRepository implements ILocationRepository {
    constructor(private readonly prisma: PrismaClient) {}
    
    async exists(idLocation: number): Promise<boolean> {
        const total = await this.prisma.location.count({where: {idLocation: idLocation}})
        return total > 0;
    }
    async findAll(): Promise<ILocation[]> {
        const rows = await this.prisma.location.findMany({
            select: {idLocation: true, name: true, address: true}, // por ahora se trae todo, si no se usa la propiedad address de ILocation se eliminará
            orderBy: {name:'asc'}, //Se ordenan alfabéticamente
        })
        return rows.map((row)=>({idLocation: row.idLocation, name: row.name, address: row.address}))
    }
}