export const BLOCK_TYPES = [
    "Calentamiento",
    "Circuito",
    "Serie",
    "Descanso",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export function isBlockType(value: unknown): value is BlockType {
    return (
        typeof value === "string" &&
        (BLOCK_TYPES as readonly string[]).includes(value)
    );
}
