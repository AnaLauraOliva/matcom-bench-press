//Contrato para hashear y comparar contraseñas
export interface IPasswordHasher {
    hash(passwordPlane: string): Promise<string>;
    compare(passwordPlane: string, passwordHash: string): Promise<boolean>;
}