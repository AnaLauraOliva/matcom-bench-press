import { Login } from "../application/use-cases/login.js";
import { RegisterUser } from "../application/use-cases/register.js";
import { RegisterPolicy } from "../domain/policies/register-policy.js";
import { createPrismaClient } from "../infrastructure/database/prisma-client.js";
import { PrismaLocationRepository } from "../infrastructure/database/repositories/prisma-sede-repository.js";
import { PrismaUserRepository } from "../infrastructure/database/repositories/prisma-user-repository.js";
import { BcryptPasswordHasher } from "../infrastructure/security/bcrypt-password-hasher.js";
import { JwtTokenService } from "../infrastructure/security/jwt-token-service.js";
import { loginSchema } from "../interfaces/http/validators/auth-schemas.js";
import { env } from './env.js';

export function buildContainer(){
    const prisma = createPrismaClient(env.DATABASE_URL);
    
    const users = new PrismaUserRepository(prisma);
    const locations = new PrismaLocationRepository(prisma);
    const hasher = new BcryptPasswordHasher(env.BCRYPT_ROUNDS);
    const tokens = new JwtTokenService(env.JWT_SECRET, env.JWT_EXPIRES_IN_SECONDS);
    const policy = new RegisterPolicy();

    return {
        prisma,
        tokens,
        login: new Login(users, hasher, tokens),
        registerUser: new RegisterUser(users, locations, hasher, policy),
    };
}