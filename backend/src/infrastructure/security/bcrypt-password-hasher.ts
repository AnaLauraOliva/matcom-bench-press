import bcrypt from 'bcrypt';
import type { IPasswordHasher } from '../../application/ports/password-hasher.js';

export class BcryptPasswordHasher implements IPasswordHasher {
    constructor(private readonly saltRounds: number) {}
    hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}