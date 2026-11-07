import type {
    ILocationDataSource,
    ILocationRecord,
} from "../../interfaces/data-sources/location-data-source.js";
import type { PrismaClient } from "./prisma-client.js";
export class PrismaLocationDataSource implements ILocationDataSource {
    constructor(private readonly prisma: PrismaClient) {}
    async existsById(idLocation: number): Promise<boolean> {
        const total = await this.prisma.location.count({
            where: { idLocation: idLocation },
        });
        return total > 0;
    }
    async findAll(): Promise<ILocationRecord[]> {
        const rows = await this.prisma.location.findMany({
            select: { idLocation: true, name: true, address: true },
            orderBy: { name: "asc" },
        });
        return rows.map((row) => ({ id: row.idLocation, name: row.name, address: row.address }));
    }
}
