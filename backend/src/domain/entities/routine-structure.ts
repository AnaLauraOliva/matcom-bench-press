import { BlockType } from "./block-types.js";
import { IntensityLevel } from "./instensity-level.js";

export interface IRoutineExercise {
    readonly kind: "EXERCISE";
    readonly idExercise: number;
    readonly order: number;
    readonly sets: number | null;
    readonly repetitions: number | null;
    readonly time: number | null;
    readonly intensity: IntensityLevel;
}

export interface IRoutineBlock {
    readonly kind: "BLOCK";
    readonly type: BlockType;
    readonly order: number;
    readonly duration: number | null;
    readonly repetitions: number | null;
    readonly items: readonly RoutineItem[];
}

export type RoutineItem = IRoutineExercise | IRoutineBlock;

export interface RoutineStructure {
    readonly idRoutine: number;
    readonly version: number;
    readonly blocks: readonly IRoutineBlock[];
}
