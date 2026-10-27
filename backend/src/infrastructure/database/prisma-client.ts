// Creación del cliente de prisma

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.js";

export type { PrismaClient };

export function createPrismaClient(connectionString: string): PrismaClient{
    const adapter = new PrismaPg({connectionString: connectionString});
    return new PrismaClient({adapter:adapter});
}