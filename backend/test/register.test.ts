import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { RegisterUser, type RegisterData } from '../src/application/use-cases/register.js';
import {
    EmailAlreadyExistsError,
    LocationNotFoundError,
    PermissionDeniedError,
} from '../src/domain/errors/domain-errors.js';
import { RegisterPolicy } from '../src/domain/policies/register-policy.js';
import {
    FakePasswordHasher,
    InMemoryLocationRepository,
    InMemoryUserRepository,
    makeUser,
} from './helpers.js';

const validData: RegisterData = {
    name: 'Ana Pérez',
    email: 'ana@example.com',
    phone: '555-0000',
    password: 'secreto',
    role: 'CLIENT',
    age: 21,
    sex: 'FEMENINO',
    locationName: 'Sede Central',
};

function buildUseCase(options: {
    users?: InMemoryUserRepository;
    locations?: InMemoryLocationRepository;
} = {}) {
    const users = options.users ?? new InMemoryUserRepository();
    const locations = options.locations ?? new InMemoryLocationRepository(['Sede Central']);
    const hasher = new FakePasswordHasher();
    const useCase = new RegisterUser(users, locations, hasher, new RegisterPolicy());
    return { users, locations, hasher, useCase };
}

describe('RegisterPolicy', () => {
    it('permite que un visitante anónimo se registre como CLIENT', () => {
        assert.equal(new RegisterPolicy().canRegister(null, 'CLIENT'), true);
    });

    it('no permite que un CLIENT registre a otro CLIENT', () => {
        assert.equal(new RegisterPolicy().canRegister('CLIENT', 'CLIENT'), false);
    });
});

describe('RegisterUser', () => {
    it('registra un cliente, pasa la contraseña hasheada y devuelve un usuario público', async () => {
        const { users, locations, useCase } = buildUseCase();

        const result = await useCase.execute({ actor: null, data: validData });

        assert.equal(result.id, 1);
        assert.equal(result.name, validData.name);
        assert.equal(result.email, validData.email);
        assert.equal(result.role, 'CLIENT');
        assert.equal(result.active, true);
        assert.equal(result.registerDate instanceof Date, true);
        assert.equal('passwordHash' in result, false);

        assert.equal(users.createCalls.length, 1);
        const sentToRepository = users.createCalls[0];
        assert.ok(sentToRepository);
        assert.equal(sentToRepository.passwordHash, 'hashed:secreto');
        assert.equal(Object.hasOwn(sentToRepository, 'password'), false);
        assert.equal(sentToRepository.locationName, 'Sede Central');
        assert.deepEqual(locations.existsCalls, ['Sede Central']);
    });

    it('rechaza un email que ya existe y no intenta crear el usuario', async () => {
        const users = new InMemoryUserRepository([makeUser({ email: validData.email })]);
        const { useCase } = buildUseCase({ users });

        await assert.rejects(
            () => useCase.execute({ actor: null, data: validData }),
            (error: unknown) => error instanceof EmailAlreadyExistsError
        );

        assert.equal(users.createCalls.length, 0);
    });

    it('rechaza el registro si la sede no existe y no intenta crear el usuario', async () => {
        const locations = new InMemoryLocationRepository();
        const { users, useCase } = buildUseCase({ locations });

        await assert.rejects(
            () => useCase.execute({ actor: null, data: validData }),
            (error: unknown) =>
                error instanceof LocationNotFoundError && error.message.includes('Sede Central')
        );

        assert.equal(users.createCalls.length, 0);
    });

    it('aplica los permisos antes de consultar el email o la sede', async () => {
        const users = new InMemoryUserRepository([makeUser({ email: validData.email })]);
        const locations = new InMemoryLocationRepository();
        const { useCase } = buildUseCase({ users, locations });

        await assert.rejects(
            () => useCase.execute({ actor: 'CLIENT', data: validData }),
            (error: unknown) => error instanceof PermissionDeniedError
        );

        assert.equal(users.findByEmailCalls.length, 0);
        assert.equal(locations.existsCalls.length, 0);
    });
});
