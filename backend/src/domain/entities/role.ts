//Lista de roles, si en el futuro hay un rol nuevo, se añade aquí
// Por ahora solo hay client, el resto se añadira luego
export const ROLES = ['CLIENT'] as const;
export type Role = (typeof ROLES)[number];

//Comprobación en tiempo de ejecución de que un valor desconocido es un rol válido
export function isRole(value: unknown): value is Role{
    return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}