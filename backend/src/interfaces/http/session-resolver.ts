import type { ITokenGateway } from "../../application/gateways/token-gateway.js";
import type { IUserProfileGateway } from "../../application/gateways/user-profile-gateway.js";
import { isDeletedUserEmail, type IUser } from "../../domain/entities/user.js";
import type { IUserActor } from "../../domain/entities/user-actor.js";
export type SessionResult =
    | { readonly kind: "anonymous" }
    | { readonly kind: "authenticated"; readonly actor: IUserActor }
    | { readonly kind: "invalid" }
    | { readonly kind: "inactive" }
    | { readonly kind: "deleted" };

// Convierte la cabecera "Authorization: Bearer <token>" en el usuario con ese token
export class SessionResolver {
    constructor(
        private readonly tokens: ITokenGateway,
        private readonly profiles: IUserProfileGateway,
    ) {}

    async resolve(
        authorizationHeader: string | undefined,
    ): Promise<SessionResult> {
        // Si no tiene cabecera, entonces la petición es anónima
        if (authorizationHeader === undefined) return { kind: "anonymous" };
        const [scheme, token] = authorizationHeader.split(" ");
        if (scheme !== "Bearer" || !token) return { kind: "invalid" };
        const actor = this.tokens.verify(token);
        if (!actor) return { kind: "invalid" };
        // Un token criptográficamente válido solo vale si su dueño sigue
        // existiendo y sigue activo: así un usuario desactivado o borrado
        // deja de operar al instante, sin esperar a que caduque el token.
        const profile = await this.profiles.findProfileById(actor.idUser);
        if (!profile) return { kind: "invalid" };
        if (!profile.active) {
            return isDeletedUserEmail(profile.email)
                ? { kind: "deleted" }
                : { kind: "inactive" };
        }
        return { kind: "authenticated", actor };
    }
}
