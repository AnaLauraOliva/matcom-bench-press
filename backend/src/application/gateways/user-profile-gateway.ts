import type { UserProfile } from "../../domain/entities/user-profile.js";

// Resultado de una operación destructiva (borrar / desactivar) sobre un usuario:
// "ok"         → la operación se aplicó;
// "not-found"  → el usuario no existe;
// "last-admin" → no se aplicó: la base quedaría sin administradores activos.
// La detección del "last-admin" es atómica (la hace el data source dentro de
// una única transacción), de modo que operaciones concurrentes nunca ven un
// estado intermedio y el invariante no se puede violar.
export type DestructiveOutcome = "ok" | "not-found" | "last-admin";

export interface IUserProfileGateway {
    findProfileById(idUser: number): Promise<UserProfile | null>

    deleteById(idUser: number): Promise<DestructiveOutcome>;

    deactivateById(idUser: number): Promise<DestructiveOutcome>;
}