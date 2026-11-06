// Contrato para convertir una contraseña en un hash
export interface IPasswordHashGateway {
    hash(plainPassword: string): Promise<string>;
    compare(plainPassword: string, passwordHash: string): Promise<boolean>;
}