import { Schema, type Connection, type Model } from "mongoose";
import type {
    IExerciseDocument,
    IBlockDocument,
    IRoutineStructureDocument,
} from "./routine-structure-document.js";

export const ROUTINE_STRUCTURE_COLLECTION = "rutina_estructura";

// Deben coincidir con BlockTypeDocument e IntensityDocument.
const BLOCK_TYPES = ["calentamiento", "circuito", "serie", "descanso"] as const;
const INTENSITY_LEVELS = ["bajo", "medio", "alto"] as const;

const exerciseSchema = new Schema<IExerciseDocument>(
    {
        id_ejercicio: Number,
        orden: Number,
        series: Number,
        repeticiones: Number,
        tiempo: Number,
        nivel_intensidad: {
            type: String,
            enum: [...INTENSITY_LEVELS],
        },
    },
    { _id: false },
);

const blockSchema = new Schema<IBlockDocument>(
    {
        tipo: {
            type: String,
            enum: [...BLOCK_TYPES],
        },
        orden: Number,
        duracion: Number,
        repeticiones: Number,
        descanso: Number,
        ejercicios: { type: [exerciseSchema], default: undefined },
    },
    { _id: false },
);

// La cantidad y composición de bloques cambia según el entrenador y el objetivo
// del cliente, así que un bloque puede anidar otros bloques (p. ej. varios
// circuitos con distintas repeticiones y descansos dentro de un circuito).
blockSchema.add({
    bloques: { type: [blockSchema], default: undefined },
});

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
