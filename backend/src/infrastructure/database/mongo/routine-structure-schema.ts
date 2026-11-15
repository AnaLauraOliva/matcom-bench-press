import { Schema, type Connection, type Model } from "mongoose";
import type {
    IExerciseDocument,
    IBlockDocument,
    IRoutineStructureDocument,
} from "./routine-structure-document.js";

export const ROUTINE_STRUCTURE_COLLECTION = "rutina_estructura";

const exerciseSchema = new Schema<IExerciseDocument>(
    {
        id_ejercicio: Number,
        orden: Number,
        series: Number,
        repeticiones: Number,
        tiempo: Number,
        nivel_intensidad: String,
    },
    { _id: false },
);

const blockSchema = new Schema<IBlockDocument>(
    {
        tipo: String,
        orden: Number,
        duracion: Number,
        repeticiones: Number,
        descanso: Number,
        ejercicios: { type: [exerciseSchema], default: undefined },
    },
    { _id: false },
);

const routineStructureSchema = new Schema<IRoutineStructureDocument>(
    {
        _id: { type: Number, required: true },
        version: { type: Number, required: true },
        bloques: { type: [blockSchema], default: undefined },
    },
    { collection: ROUTINE_STRUCTURE_COLLECTION, versionKey: false },
);

export function createRoutineStructureModel(
    connection: Connection,
): Model<IRoutineStructureDocument> {
    return connection.model<IRoutineStructureDocument>(
        "rutina_estructura",
        routineStructureSchema,
    );
}
