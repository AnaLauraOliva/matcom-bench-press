import bcrypt from "bcrypt";
import type { IPasswordHashGateway } from "../../application/gateways/password-hash-gateway.js";
export class BcryptPasswordHashGateway implements IPasswordHashGateway {
    // "rounds" = cuánto trabajo hace bcrypt (más rondas = más lento para un atacante).
    constructor(private readonly rounds: number) {}
    hash(plainPassword: string): Promise<string> {
        return bcrypt.hash(plainPassword, this.rounds);
    }
    compare(plainPassword: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, passwordHash);
    }
}
