// Fakes y constructores compartidos por los tests.
// No tocan la base de datos: implementan los mismos contratos que usa la aplicación.

import type { IPayloadToken, ITokenService } from "../src/application/ports/token-service.js";
import type { IPasswordHasher } from "../src/application/ports/password-hasher.js";
import type { IUser, NewUser } from "../src/domain/entities/user.js";
import type { ILocationRepository } from "../src/domain/repositories/location-repository.js";
import type { IUserRepository } from "../src/domain/repositories/user-repository.js";

export function makeUser(overrides: Partial<IUser> = {}): IUser {
    return {
        idUser: 1,
        phone: '555-0000',
        registerDate: new Date('2026-01-01T00:00:00.000Z'),
        active: true,
        name: 'Ana Pérez',
        email: 'ana@example.com',
        passwordHash: 'hashed:secreto',
        role: 'CLIENT',
        ...overrides,
    };
}

export function makeNewUser(overrides: Partial<NewUser> = {}): NewUser {
    return {
        role: 'CLIENT',
        name: 'Ana Pérez',
        email: 'ana@example.com',
        phone: '555-0000',
        passwordHash: 'hashed:secreto',
        age: 21,
        sex: 'FEMENINO',
        locationName: 'Sede Central',
        ...overrides,
    };
}

export class InMemoryUserRepository implements IUserRepository {
    readonly users: IUser[] = [];
    readonly createCalls: NewUser[] = [];
    readonly findByEmailCalls: string[] = [];
    readonly findByNameCalls: string[] = [];

    constructor(seed: IUser[] = []) {
        this.users.push(...seed);
    }

    async create(user: NewUser): Promise<IUser> {
        this.createCalls.push(user);
        const created = makeUser({
            idUser: this.users.length + 1,
            phone: user.phone,
            name: user.name,
            email: user.email,
            passwordHash: user.passwordHash,
            role: user.role,
        });
        this.users.push(created);
        return created;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        this.findByEmailCalls.push(email);
        return this.users.find((user) => user.email === email) ?? null;
    }

    async findByName(name: string): Promise<IUser[]> {
        this.findByNameCalls.push(name);
        return this.users.filter((user) => user.name === name);
    }
}

export class InMemoryLocationRepository implements ILocationRepository {
    readonly locations = new Set<string>();
    readonly existsCalls: string[] = [];

    constructor(names: string[] = []) {
        names.forEach((name) => this.locations.add(name));
    }

    async exists(locationName: string): Promise<boolean> {
        this.existsCalls.push(locationName);
        return this.locations.has(locationName);
    }
}

export class FakePasswordHasher implements IPasswordHasher {
    async hash(passwordPlane: string): Promise<string> {
        return `hashed:${passwordPlane}`;
    }

    async compare(passwordPlane: string, passwordHash: string): Promise<boolean> {
        return passwordHash === `hashed:${passwordPlane}`;
    }
}

export class FakeTokenService implements ITokenService {
    lastPayload: IPayloadToken | null = null;

    generate(payload: IPayloadToken): string {
        this.lastPayload = payload;
        return `fake-token:${payload.idUser}:${payload.role}`;
    }

    verify(token: string): IPayloadToken {
        const [prefix, idUser, role] = token.split(':');
        if (prefix !== 'fake-token' || idUser === undefined || role !== 'CLIENT') {
            throw new Error('Token falso inválido');
        }
        return { idUser: Number(idUser), role: 'CLIENT' };
    }
}
