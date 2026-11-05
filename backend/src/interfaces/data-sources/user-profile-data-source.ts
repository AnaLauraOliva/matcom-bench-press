import type { Gender } from "../../domain/entities/gender.js";
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
    // Devuelven true si el usuario existía.
    deleteById(idUser: number): Promise<boolean>;
    deactivateById(idUser: number): Promise<boolean>;
}
