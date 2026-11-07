import type { Gender } from "../../domain/entities/gender.js";
// Una fila de usuario tal como la entrega el almacenamiento: refleja las TABLAS (una por rol),
// todavía sin interpretar. El gateway es quien deduce el rol a partir de ellas.
export interface IUserRecord {
    readonly idUser: number;
    readonly phone: string;
    readonly registerDate: Date;
    readonly active: boolean;
    readonly name: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly isAdmin: boolean;
    readonly isTrainer: { readonly isHeadTrainer: boolean } | null;
    readonly isClient: boolean;
}
interface INewUserRecordBase {
    readonly phone: string;
    readonly name: string;
    readonly email: string;
    readonly passwordHash: string;
}
// Qué hay que insertar: el usuario y la fila de la tabla de su rol.
export type NewUserRecord = INewUserRecordBase &
    (
        | { readonly role: "admin" }
        | {
              readonly role: "trainer";
              readonly specialty: string;
              readonly isHeadTrainer: boolean;
          }
        | {
              readonly role: "client";
              readonly age: number;
              readonly gender: Gender;
              readonly idLocation: number;
          }
    );
// Acceso al almacenamiento de usuarios (lo implementa la capa de frameworks).
export interface IUserDataSource {
    findByEmail(email: string): Promise<IUserRecord | null>;
    // Lanza EmailAlreadyExistsError si el email ya existe o PhoneAlreadyExists si el teléfono ya existe.
    insert(record: NewUserRecord): Promise<IUserRecord>;
}
