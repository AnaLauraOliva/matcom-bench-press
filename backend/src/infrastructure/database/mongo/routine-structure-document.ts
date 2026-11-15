// Formato del documento tal como se guarda en MongoDB (colección "rutina_estructura")

export type BlockTypeDocument = 'calentamiento' | 'circuito' | 'serie' | 'descanso';
export type IntensityDocument = 'bajo' | 'medio' | 'alto';

export interface IExerciseDocument {
    id_ejercicio: number;
    orden: number;
    series: number | null;
    repeticiones: number | null;
    tiempo: number | null;
    nivel_intensidad: IntensityDocument;
}

export interface IBlockDocument {
    tipo: BlockTypeDocument;
    orden: number;
    duracion: number | null;
    repeticiones: number | null;
    descanso: number | null;
    ejercicios: IExerciseDocument[];
}

export interface IRoutineStructureDocument {
    _id: number;
    version: number;
    bloques: IBlockDocument[];
}