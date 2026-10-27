// Implementación del contrato IUserRepository usando Prisma como ORM para interactuar con la base de datos.

import type { NewUser, IUser } from "../../../domain/entities/user.js";
import { EmailAlreadyExistsError } from "../../../domain/errors/domain-errors.js";
import type { IUserRepository } from "../../../domain/repositories/user-repository.js";
import type { PrismaClient } from "../prisma-client.js";
import { INCLUDE_ROLE, toUser } from "./user-mapper.js";

function isUniqueConstraintViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

function roleData (newUser: NewUser) {
    switch (newUser.role) {
        case 'CLIENT':
            return { 
                client: {
                    create: {
                        age: newUser.age,
                        sex: newUser.sex,
                        location: {connect: {name: newUser.locationName}}
                    }
                } 
            };
        case 'ADMIN':
            return { admin: { create: {}}};
        case 'TRAINER':
            return { trainer: { create: {specialty: newUser.specialty}}};
        case 'HEAD_TRAINER':
            return {
                trainer: {
                    create: {specialty: newUser.specialty, headTrainer: { create: {}}}
                }
            };
    }
}

export class PrismaUserRepository implements IUserRepository {
    
    constructor(private readonly prisma: PrismaClient) {}   
    async create(newUser: NewUser): Promise<IUser> {
        try {
            const row = await this.prisma.user.create({
                data: {
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    password: newUser.passwordHash,
                    ...roleData(newUser)
                },
                include: INCLUDE_ROLE
            });
            return toUser(row);
        } catch (error) {
            if (isUniqueConstraintViolation(error)) {
                throw new EmailAlreadyExistsError();
            }
            throw error;
        }
    }
    async findByEmail(email: string): Promise<IUser | null> {
        const row = await this.prisma.user.findUnique({
            where: { email },
            include: INCLUDE_ROLE
        });
        return row ? toUser(row) : null;
    }
    async findByName(name: string): Promise<IUser[]> {
        const rows = await this.prisma.user.findMany({
            where: { name },
            include: INCLUDE_ROLE
        });
        return rows.map(toUser);
    }

    
}