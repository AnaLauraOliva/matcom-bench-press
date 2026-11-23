export const INTENSITY_LEVELS = ["Bajo", "Medio", "Alto"] as const;

export type IntensityLevel = (typeof INTENSITY_LEVELS)[number];

export function isIntensityLevel(value: unknown): value is IntensityLevel {
    return (
        typeof value === "string" &&
        (INTENSITY_LEVELS as readonly string[]).includes(value)
    );
}
