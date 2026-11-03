import type { Sex } from "../../../domain/entities/sex.js";
import type { UserProfile } from "../../../domain/entities/user-profile.js";    

export const INCLUDE_PROFILE = {
    admin: true,
    trainer: {include: {headTrainer: true}},
    client: {include: {location: true}},
} as const;

export interface IUserProfileRow {
    idUser: number;
    phone: string;
    registerDate: Date;
    active: boolean;
    name: string;
    email: string;
    admin: object | null;
    trainer: { specialty: string; headTrainer: object | null } | null;
    client: { age: number; sex: Sex; location: { idLocation:number; name: string, address: string } } | null;
}

export function toUserProfile(row: IUserProfileRow): UserProfile {
    const base = {
        idUser: row.idUser,
        name: row.name,
        email: row.email,
        phone: row.phone,
        active: row.active,
        registerDate: row.registerDate,
    };
    if (row.admin) return {...base, role:'ADMIN'};
    if (row.trainer)return {...base, role: row.trainer.headTrainer ? 'HEAD_TRAINER': 'TRAINER',specialty:row.trainer.specialty};
    if (row.client) return {...base, role: 'CLIENT', age: row.client.age, sex: row.client.sex, location: {idLocation: row.client.location.idLocation, name: row.client.location.name, address: row.client.location.address}};
    throw new Error(`El usuario ${row.idUser} no tiene ningún rol asociado (datos inconsistentes).`);
}