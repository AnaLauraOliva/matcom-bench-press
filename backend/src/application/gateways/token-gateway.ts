import type { IUserActor } from "../../domain/entities/user-actor.js";

// Contrato para fabricar y comprobar tokens de sesión
export interface ITokenGateway {
    generate(actor:IUserActor): string;

    // Devuelve dueño del token o null si es falso, está roto o ha caducado
    verify(token: string): IUserActor | null;
}