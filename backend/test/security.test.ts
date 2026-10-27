import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

import { isRole } from '../src/domain/entities/role.js';
import { InvalidTokenError } from '../src/domain/errors/domain-errors.js';
import { BcryptPasswordHasher } from '../src/infrastructure/security/bcrypt-password-hasher.js';
import { JwtTokenService } from '../src/infrastructure/security/jwt-token-service.js';

const SECRET = 'secreto-de-prueba';

describe('BcryptPasswordHasher', () => {
    const hasher = new BcryptPasswordHasher(4);

    it('genera un hash distinto de la contraseña y la verifica correctamente', async () => {
        const hash = await hasher.hash('secreto');

        assert.notEqual(hash, 'secreto');
        assert.equal(await hasher.compare('secreto', hash), true);
        assert.equal(await hasher.compare('otra-contraseña', hash), false);
    });

    it('genera hashes diferentes para la misma contraseña por el salt', async () => {
        const [first, second] = await Promise.all([
            hasher.hash('secreto'),
            hasher.hash('secreto'),
        ]);

        assert.notEqual(first, second);
    });
});

describe('JwtTokenService', () => {
    const service = new JwtTokenService(SECRET, 60);

    it('genera y verifica un token con el id y el rol', () => {
        const token = service.generate({ idUser: 42, role: 'CLIENT' });

        assert.deepEqual(service.verify(token), { idUser: 42, role: 'CLIENT' });
    });

    it('rechaza un token con formato inválido', () => {
        assert.throws(() => service.verify('no-es-un-token'), InvalidTokenError);
    });

    it('rechaza un token firmado con otro secreto', () => {
        const otherService = new JwtTokenService('otro-secreto', 60);
        const token = otherService.generate({ idUser: 1, role: 'CLIENT' });

        assert.throws(() => service.verify(token), InvalidTokenError);
    });

    it('rechaza un token con un rol desconocido', () => {
        const token = jwt.sign({ role: 'ADMIN' }, SECRET, {
            algorithm: 'HS256',
            subject: '1',
        });

        assert.throws(() => service.verify(token), InvalidTokenError);
    });

    it('rechaza un token cuyo subject no es un id numérico', () => {
        const token = jwt.sign({ role: 'CLIENT' }, SECRET, {
            algorithm: 'HS256',
            subject: 'abc',
        });

        assert.throws(() => service.verify(token), InvalidTokenError);
    });
});

describe('isRole', () => {
    it('acepta el rol CLIENT', () => {
        assert.equal(isRole('CLIENT'), true);
    });

    it('rechaza roles y valores desconocidos', () => {
        assert.equal(isRole('ADMIN'), false);
        assert.equal(isRole(null), false);
        assert.equal(isRole(42), false);
    });
});
