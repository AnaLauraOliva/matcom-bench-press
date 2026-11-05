import type { ITokenGateway } from "../../application/gateways/token-gateway.js";
import type { IUserActor } from "../../domain/entities/user-actor.js";
export type SessionResult =
    | { readonly kind: "anonymous" }
    | { readonly kind: "authenticated"; readonly actor: IUserActor }
    | { readonly kind: "invalid" };

// Convierte la cabecera "Authorization: Bearer <token>" en el usuario con ese token
export class SessionResolver {
    constructor(private readonly tokens: ITokenGateway) {}
    resolve(authorizationHeader: string | undefined): SessionResult {
        // Si no tiene cabecera, entonces la petición es anónima
        if (authorizationHeader === undefined) return { kind: "anonymous" };
        const [scheme, token] = authorizationHeader.split(" ");
        if (scheme !== "Bearer" || !token) return { kind: "invalid" };
        const actor = this.tokens.verify(token);
        return actor ? { kind: "authenticated", actor } : { kind: "invalid" };
    }
}
