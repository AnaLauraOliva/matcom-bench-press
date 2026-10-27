import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Login } from '../src/application/use-cases/login.js';
import {
    AmbiguousNameError,
    InactiveUserError,
    InvalidCredentialsError,
} from '../src/domain/errors/domain-errors.js';
import {
    FakePasswordHasher,
    FakeTokenService,
    InMemoryUserRepository,
    makeUser,
} from './helpers.js';

function buildLogin(users: InMemoryUserRepository) {
    const tokens = new FakeTokenService();
    const login = new Login(users, new FakePasswordHasher(), tokens);
    return { login, tokens };
}

describe('Login', () => {
    it('inicia sesión por email y devuelve un token y el usuario público', async () => {
        const user = makeUser();
        const users = new InMemoryUserRepository([user]);
        const { login, tokens } = buildLogin(users);

        const result = await login.execute({
            identificator: { email: user.email },
            password: 'secreto',
        });

        assert.equal(result.token, 'fake-token:1:CLIENT');
        assert.deepEqual(tokens.lastPayload, { idUser: 1, role: 'CLIENT' });
        assert.equal(result.user.id, user.idUser);
        assert.equal(result.user.name, user.name);
        assert.equal(result.user.email, user.email);
        assert.equal('passwordHash' in result.user, false);
    });

    it('rechaza una contraseña incorrecta', async () => {
        const users = new InMemoryUserRepository([makeUser()]);
        const { login } = buildLogin(users);

        await assert.rejects(
            () =>
                login.execute({
                    identificator: { email: 'ana@example.com' },
                    password: 'incorrecta',
                }),
            (error: unknown) => error instanceof InvalidCredentialsError
        );
    });

    it('rechaza un email que no existe', async () => {
        const users = new InMemoryUserRepository();
        const { login } = buildLogin(users);

        await assert.rejects(
            () =>
                login.execute({
                    identificator: { email: 'nadie@example.com' },
                    password: 'secreto',
                }),
            (error: unknown) => error instanceof InvalidCredentialsError
        );
    });

    it('rechaza a un usuario inactivo cuando la contraseña es correcta', async () => {
        const users = new InMemoryUserRepository([makeUser({ active: false })]);
        const { login } = buildLogin(users);

        await assert.rejects(
            () =>
                login.execute({
                    identificator: { email: 'ana@example.com' },
                    password: 'secreto',
                }),
            (error: unknown) => error instanceof InactiveUserError
        );
    });

    it('no revela que la cuenta está inactiva si la contraseña es incorrecta', async () => {
        const users = new InMemoryUserRepository([makeUser({ active: false })]);
        const { login } = buildLogin(users);

        await assert.rejects(
            () =>
                login.execute({
                    identificator: { email: 'ana@example.com' },
                    password: 'incorrecta',
                }),
            (error: unknown) => error instanceof InvalidCredentialsError
        );
    });

    it('inicia sesión por nombre cuando hay una única coincidencia', async () => {
        const users = new InMemoryUserRepository([makeUser()]);
        const { login } = buildLogin(users);

        const result = await login.execute({
            identificator: { name: 'Ana Pérez' },
            password: 'secreto',
        });

        assert.equal(result.user.id, 1);
        assert.equal(result.token, 'fake-token:1:CLIENT');
    });

    it('rechaza el login por nombre si no hay coincidencias', async () => {
        const users = new InMemoryUserRepository();
        const { login } = buildLogin(users);

        await assert.rejects(
            () =>
                login.execute({
                    identificator: { name: 'No Existe' },
                    password: 'secreto',
                }),
            (error: unknown) => error instanceof InvalidCredentialsError
        );
    });

    it('rechaza el login por nombre si hay varias coincidencias', async () => {
        const users = new InMemoryUserRepository([
            makeUser({ idUser: 1, email: 'ana1@example.com' }),
            makeUser({ idUser: 2, email: 'ana2@example.com' }),
        ]);
        const { login } = buildLogin(users);

        await assert.rejects(
            () =>
                login.execute({
                    identificator: { name: 'Ana Pérez' },
                    password: 'secreto',
                }),
            (error: unknown) => error instanceof AmbiguousNameError
        );
    });
});
