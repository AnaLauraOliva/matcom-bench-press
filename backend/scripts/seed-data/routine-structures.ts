import type { IRoutineStructureDocument } from "../../src/infrastructure/database/mongo/routine-structure-document";

// La estructura de bloques es variable según el entrenador y el objetivo del
// cliente: la rutina 3 son pocos bloques simples, la 2 es intermedia y la 1
// anida múltiples circuitos con distintas repeticiones y tiempos de descanso.

const ROUTINE_ID = {
    fullBodyStrength: 1,
    basicEndurance: 2,
    generalMobility: 3,
};

const EXERCISE_ID = {
    benchPress: 1,
    squat: 2,
    dumbbellRow: 3,
    bicepsCurl: 4,
    fastWalk: 5,
    stationaryBike: 6,
    abdominalPlank: 7,
    hamstringStretch: 8,
    chestStretch: 9,
    hipMobility: 10,
};

export const routineStructureSeedData: IRoutineStructureDocument[] = [
    // Rutina 1: Fuerza cuerpo completo (ejercicios 1, 2, 3, 4 y 7)
    // Estructura compleja: circuito principal que anida dos circuitos con
    // repeticiones y descansos distintos.
    {
        _id: ROUTINE_ID.fullBodyStrength,
        version: 1,
        bloques: [
            {
                tipo: "calentamiento",
                orden: 1,
                duracion: 10,
                repeticiones: null,
                descanso: null,
                ejercicios: [
                    {
                        id_ejercicio: EXERCISE_ID.abdominalPlank,
                        orden: 1,
                        series: 2,
                        repeticiones: null,
                        tiempo: 30,
                        nivel_intensidad: "bajo",
                    },
                ],
            },
            {
                tipo: "serie",
                orden: 2,
                duracion: null,
                repeticiones: null,
                descanso: 2,
                ejercicios: [
                    {
                        id_ejercicio: EXERCISE_ID.benchPress,
                        orden: 1,
                        series: 4,
                        repeticiones: 8,
                        tiempo: null,
                        nivel_intensidad: "alto",
                    },
                    {
                        id_ejercicio: EXERCISE_ID.squat,
                        orden: 2,
                        series: 4,
                        repeticiones: 8,
                        tiempo: null,
                        nivel_intensidad: "alto",
                    },
                ],
            },
            {
                tipo: "descanso",
                orden: 3,
                duracion: 3,
                repeticiones: null,
                descanso: null,
                ejercicios: [],
            },
            {
                tipo: "circuito",
                orden: 4,
                duracion: null,
                repeticiones: 4,
                descanso: null,
                ejercicios: [],
                bloques: [
                    {
                        tipo: "circuito",
                        orden: 1,
                        duracion: null,
                        repeticiones: 3,
                        descanso: 1,
                        ejercicios: [
                            {
                                id_ejercicio: EXERCISE_ID.dumbbellRow,
                                orden: 1,
                                series: 3,
                                repeticiones: 12,
                                tiempo: null,
                                nivel_intensidad: "medio",
                            },
                            {
                                id_ejercicio: EXERCISE_ID.bicepsCurl,
                                orden: 2,
                                series: 3,
                                repeticiones: 12,
                                tiempo: null,
                                nivel_intensidad: "medio",
                            },
                        ],
                    },
                    {
                        tipo: "circuito",
                        orden: 2,
                        duracion: null,
                        repeticiones: 2,
                        descanso: 2,
                        ejercicios: [
                            {
                                id_ejercicio: EXERCISE_ID.squat,
                                orden: 1,
                                series: 3,
                                repeticiones: 15,
                                tiempo: null,
                                nivel_intensidad: "medio",
                            },
                            {
                                id_ejercicio: EXERCISE_ID.abdominalPlank,
                                orden: 2,
                                series: 3,
                                repeticiones: null,
                                tiempo: 45,
                                nivel_intensidad: "medio",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // Rutina 2: Resistencia básica (ejercicios 5, 6, 7 y 2)
    // Estructura intermedia: bloques planos, sin anidamiento.
    {
        _id: ROUTINE_ID.basicEndurance,
        version: 1,
        bloques: [
            {
                tipo: "calentamiento",
                orden: 1,
                duracion: 5,
                repeticiones: null,
                descanso: null,
                ejercicios: [
                    {
                        id_ejercicio: EXERCISE_ID.fastWalk,
                        orden: 1,
                        series: null,
                        repeticiones: null,
                        tiempo: 5,
                        nivel_intensidad: "bajo",
                    },
                ],
            },
            {
                tipo: "circuito",
                orden: 2,
                duracion: null,
                repeticiones: 3,
                descanso: 1,
                ejercicios: [
                    {
                        id_ejercicio: EXERCISE_ID.stationaryBike,
                        orden: 1,
                        series: null,
                        repeticiones: null,
                        tiempo: 10,
                        nivel_intensidad: "medio",
                    },
                    {
                        id_ejercicio: EXERCISE_ID.abdominalPlank,
                        orden: 2,
                        series: null,
                        repeticiones: null,
                        tiempo: 40,
                        nivel_intensidad: "medio",
                    },
                    {
                        id_ejercicio: EXERCISE_ID.squat,
                        orden: 3,
                        series: 3,
                        repeticiones: 12,
                        tiempo: null,
                        nivel_intensidad: "medio",
                    },
                ],
            },
            {
                tipo: "descanso",
                orden: 3,
                duracion: 3,
                repeticiones: null,
                descanso: null,
                ejercicios: [],
            },
        ],
    },

    // Rutina 3: Movilidad general (ejercicios 8, 9 y 10)
    // Estructura simple: pocos bloques, cada uno con una sola composición.
    {
        _id: ROUTINE_ID.generalMobility,
        version: 1,
        bloques: [
            {
                tipo: "calentamiento",
                orden: 1,
                duracion: 5,
                repeticiones: null,
                descanso: null,
                ejercicios: [
                    {
                        id_ejercicio: EXERCISE_ID.hipMobility,
                        orden: 1,
                        series: 2,
                        repeticiones: 10,
                        tiempo: null,
                        nivel_intensidad: "bajo",
                    },
                ],
            },
            {
                tipo: "serie",
                orden: 2,
                duracion: null,
                repeticiones: null,
                descanso: 1,
                ejercicios: [
                    {
                        id_ejercicio: EXERCISE_ID.hamstringStretch,
                        orden: 1,
                        series: 3,
                        repeticiones: null,
                        tiempo: 30,
                        nivel_intensidad: "bajo",
                    },
                    {
                        id_ejercicio: EXERCISE_ID.chestStretch,
                        orden: 2,
                        series: 3,
                        repeticiones: null,
                        tiempo: 30,
                        nivel_intensidad: "bajo",
                    },
                ],
            },
        ],
    },
];
