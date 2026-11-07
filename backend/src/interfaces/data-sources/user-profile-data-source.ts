import type { Gender } from "../../domain/entities/gender.js";
// El tipo lo define la capa de aplicación: es el gateway quien traduce el
// resultado a errores de negocio (outer depende de inner: dirección permitida).
import type { DestructiveOutcome } from "../../application/gateways/user-profile-gateway.js";
// Una ficha de usuario tal como la entrega el almacenamiento.
export interface IUserProfileRecord {
    readonly idUser: number;
    readonly phone: string;
    readonly registerDate: Date;
    readonly active: boolean;
    readonly name: string;
    readonly email: string;
    readonly isAdmin: boolean;
    readonly trainer: {
        readonly specialty: string;
        readonly isHeadTrainer: boolean;
    } | null;
    readonly client: {
        readonly age: number;
        readonly gender: Gender;
        readonly location: { readonly id: number; readonly name: string, address: string };
    } | null;
}
export interface IUserProfileDataSource {
    findById(idUser: number): Promise<IUserProfileRecord | null>;
    // Borra suavemente o desactiva a un usuario. Son operaciones ATÓMICAS:
    // si el objetivo es el último administrador activo, la operación no se
    // aplica y devuelve "last-admin"; ninguna secuencia concurrente puede
    // dejar la base sin administradores. Devuelve "not-found" si no existe.
    deleteById(idUser: number): Promise<DestructiveOutcome>;
    deactivateById(idUser: number): Promise<DestructiveOutcome>;
}
