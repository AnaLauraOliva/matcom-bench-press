import jwt from 'jsonwebtoken';
import type { IPayloadToken, ITokenService } from '../../application/ports/token-service.js';
import { isRole } from '../../domain/entities/role.js';
import { InvalidTokenError } from '../../domain/errors/domain-errors.js';

export class JwtTokenService implements ITokenService {
    constructor(private readonly secret: string,
                private readonly expiresIn: number) {}
    
    generate(payload: IPayloadToken): string {
        return jwt.sign({role: payload.role},this.secret, {
            algorithm: 'HS256',
            subject: String(payload.idUser),
            expiresIn: this.expiresIn
        })
    }
    verify(token: string): IPayloadToken {
        try {
            const data = jwt.verify(token, this.secret, {algorithms: ['HS256']});
            if (typeof data === 'string' ) throw new InvalidTokenError();

            const idUser = Number(data.sub);
            if (!Number.isInteger(idUser) || !isRole(data.role)) throw new InvalidTokenError();
            return {idUser, role: data.role};
        } catch {
            throw new InvalidTokenError();
        }
    }
}