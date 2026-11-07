import jwt from "jsonwebtoken";
import type { ITokenGateway } from "../../application/gateways/token-gateway.js";
import { isRole } from "../../domain/entities/role.js";
import type { IUserActor } from "../../domain/entities/user-actor.js";
export class JwtTokenGateway implements ITokenGateway {
    constructor(
        private readonly secret: string,
        private readonly expiresInSeconds: number,
    ) {}
    generate(actor: IUserActor): string {
        return jwt.sign({ role: actor.role }, this.secret, {
            algorithm: "HS256",
            subject: String(actor.idUser), // "sub" = a quién pertenece el token
            expiresIn: this.expiresInSeconds,
        });
    }
    verify(token: string): IUserActor | null {
        try {
            const payload = jwt.verify(token, this.secret, {
                algorithms: ["HS256"],
            });
            if (typeof payload === "string") return null;
            const idUser = Number(payload.sub);
            if (!Number.isInteger(idUser) || !isRole(payload.role)) return null;
            return { idUser, role: payload.role };
        } catch {
            // Firma falsa, token caducado, formato roto... todo cuenta como "token no válido".
            return null;
        }
    }
}
