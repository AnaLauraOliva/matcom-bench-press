// Contrato para convertir una contraseña en un hash
export interface IPasswordHashGateway {
    hash(plainPassword: string): Promise<string>;
    compare(plainPassord: string, passwordHash: string): Promise<boolean>;
}