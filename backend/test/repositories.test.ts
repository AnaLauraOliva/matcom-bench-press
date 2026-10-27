import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { EmailAlreadyExistsError } from '../src/domain/errors/domain-errors.js';
import type { PrismaClient } from '../src/infrastructure/database/prisma-client.js';
import { PrismaLocationRepository } from '../src/infrastructure/database/repositories/prisma-sede-repository.js';
import { PrismaUserRepository } from '../src/infrastructure/database/repositories/prisma-user-repository.js';
import {
    delegateRole,
    toUser,
    type IUserRow,
} from '../src/infrastructure/database/repositories/user-mapper.js';
import { makeNewUser } from './helpers.js';

function makeRow(overrides: Partial<IUserRow> = {}): IUserRow {
    return {
        idUser: 10,
        name: 'Ana Pérez',
        email: 'ana@example.com',
        phone: '555-0000',
        registerDate: new Date('2026-01-01T00:00:00.000Z'),
        active: true,
        password: 'hashed:secreto',
        client: { idUser: 10, age: 21, sex: 'FEMENINO', idLocation: 1 },
        ...overrides,
    };
}

describe('user-mapper', () => {
    it('convierte una fila de Prisma al usuario del dominio', () => {
        const row = makeRow();

        const user = toUser(row);

        assert.deepEqual(user, {
            idUser: row.idUser,
            name: row.name,
            email: row.email,
            phone: row.phone,
            role: 'CLIENT',
            active: row.active,
            registerDate: row.registerDate,
            passwordHash: row.password,
        });
    });

    it('deduce CLIENT cuando la fila tiene un cliente asociado', () => {
        assert.equal(delegateRole(makeRow()), 'CLIENT');
    });

    it('falla si la fila no tiene ningún rol asociado', () => {
        assert.throws(
            () => delegateRole(makeRow({ client: null })),
            /no tiene un rol asignado/
        );
    });
});

describe('PrismaUserRepository', () => {
    it('crea el usuario y su cliente con la relación location correcta', async () => {
        const row = makeRow();
        let received: { data: unknown; include: unknown } | undefined;

        const prisma = {
            user: {
                create: async (args: { data: unknown; include: unknown }) => {
                    received = args;
                    return row;
                },
            },
        } as unknown as PrismaClient;

        const repository = new PrismaUserRepository(prisma);
        const newUser = makeNewUser();

        const result = await repository.create(newUser);

        assert.ok(received);
        assert.deepEqual(received.data, {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            password: newUser.passwordHash,
            client: {
                create: {
                    age: newUser.age,
                    sex: newUser.sex,
                    location: { connect: { name: newUser.locationName } },
                },
            },
        });
        assert.deepEqual(received.include, { client: true });
        assert.deepEqual(result, toUser(row));
    });

    it('traduce la violación de unicidad P2002 a EmailAlreadyExistsError', async () => {
        const prisma = {
            user: {
                create: async () => {
                    throw { code: 'P2002' };
                },
            },
        } as unknown as PrismaClient;

        const repository = new PrismaUserRepository(prisma);

        await assert.rejects(
            () => repository.create(makeNewUser()),
            (error: unknown) => error instanceof EmailAlreadyExistsError
        );
    });

    it('relanza otros errores que no sean P2002', async () => {
        const original = new Error('la base de datos no responde');
        const prisma = {
            user: {
                create: async () => {
                    throw original;
                },
            },
        } as unknown as PrismaClient;

        const repository = new PrismaUserRepository(prisma);

        await assert.rejects(
            () => repository.create(makeNewUser()),
            (error: unknown) => error === original
        );
    });

    it('devuelve null cuando el email no existe', async () => {
        const prisma = {
            user: {
                findUnique: async () => null,
            },
        } as unknown as PrismaClient;

        const repository = new PrismaUserRepository(prisma);

        assert.equal(await repository.findByEmail('nadie@example.com'), null);
    });

    it('mapea el usuario encontrado por email e incluye su rol', async () => {
        const row = makeRow({ email: 'ana@example.com' });
        const prisma = {
            user: {
                findUnique: async () => row,
            },
        } as unknown as PrismaClient;

        const repository = new PrismaUserRepository(prisma);
        const user = await repository.findByEmail('ana@example.com');

        assert.ok(user);
        assert.equal(user.idUser, row.idUser);
        assert.equal(user.email, row.email);
        assert.equal(user.role, 'CLIENT');
    });

    it('mapea todos los usuarios encontrados por nombre', async () => {
        const rows = [
            makeRow({ idUser: 1, email: 'ana1@example.com' }),
            makeRow({ idUser: 2, email: 'ana2@example.com' }),
        ];
        let receivedWhere: unknown;

        const prisma = {
            user: {
                findMany: async (args: { where: unknown }) => {
                    receivedWhere = args.where;
                    return rows;
                },
            },
        } as unknown as PrismaClient;

        const repository = new PrismaUserRepository(prisma);
        const users = await repository.findByName('Ana Pérez');

        assert.deepEqual(receivedWhere, { name: 'Ana Pérez' });
        assert.deepEqual(users.map((user) => user.idUser), [1, 2]);
        assert.deepEqual(users.map((user) => user.email), ['ana1@example.com', 'ana2@example.com']);
    });
});

describe('PrismaLocationRepository', () => {
    it('indica si la sede existe consultando por nombre', async () => {
        let receivedWhere: unknown;

        const prisma = {
            location: {
                findUnique: async (args: { where: unknown }) => {
                    receivedWhere = args.where;
                    const where = args.where as { name: string };
                    return where.name === 'Sede Central'
                        ? { idLocation: 1, name: 'Sede Central', address: 'Calle 1' }
                        : null;
                },
            },
        } as unknown as PrismaClient;

        const repository = new PrismaLocationRepository(prisma);

        assert.equal(await repository.exists('Sede Central'), true);
        assert.equal(await repository.exists('Sede Norte'), false);
        assert.deepEqual(receivedWhere, { name: 'Sede Norte' });
    });
});
