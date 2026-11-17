// Formato del documento tal como se guarda en MongoDB (colección "rutina_estructura")
//
// La estructura de una rutina es variable: depende del entrenador y del objetivo
// del cliente. Una rutina puede tener pocos bloques simples (calentamiento,
// serie, descanso), y otra puede anidar múltiples circuitos con distintas
// repeticiones y tiempos de descanso; por eso un bloque puede contener
// ejercicios, otros bloques, o ambos.

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
    // Bloques anidados dentro de este bloque (p. ej. varios circuitos dentro de
    // un circuito), cada uno con sus propias repeticiones y descansos.
    bloques?: IBlockDocument[];
}

export interface IRoutineStructureDocument {
    _id: number;
    version: number;
    bloques: IBlockDocument[];
}