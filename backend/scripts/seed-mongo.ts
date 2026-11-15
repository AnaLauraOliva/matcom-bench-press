import "dotenv/config";
import { connectMongo } from "../src/infrastructure/database/mongo/connect-mongo";
import { createRoutineStructureModel } from "../src/infrastructure/database/mongo/routine-structure-schema";
import { routineStructureSeedData } from "./seed-data/routine-structures";

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Falta la variable de entorno ${name}`);
    return value;
}

const connection = await connectMongo(requiredEnv("MONGODB_URI"));

try {
    const model = createRoutineStructureModel(connection);
    for (const { _id, ...rest } of routineStructureSeedData) {
        // Solo se inserta si no existe: si ya hay un documento con ese _id, no lo toca.

        const result = await model.updateOne(
            { _id },
            { $setOnInsert: rest },
            { upsert: true },
        );

        console.log(
            result.upsertedCount > 0
                ? `Rutina ${_id}: estructura creada.`
                : `Rutina ${_id}: ya existía, no se modificó.`,
        );
    }
} finally {
    await connection.close();
}
