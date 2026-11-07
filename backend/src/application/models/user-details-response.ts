import type { Gender } from "../../domain/entities/gender.js";
import type { UserProfile } from "../../domain/entities/user-profile.js";
import { toLocationResponse, type ILocationResponse } from "./location-response.js";

interface IUserDetailsBase {
    readonly idUser: number;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly active: boolean;
    readonly registerDate: Date;
}

export type UserDetailsResponse = 
| (IUserDetailsBase & { readonly role: 'ADMIN' })
| (IUserDetailsBase & {
        readonly role: 'TRAINER' | 'HEAD_TRAINER';
        readonly specialty: string;
    })
| (IUserDetailsBase & {
        readonly role: 'CLIENT';
        readonly age: number;
        readonly gender: Gender;
        readonly location: ILocationResponse;
    });

export function toUserDetailsResponse(profile: UserProfile): UserDetailsResponse {
    const base = {
        idUser: profile.idUser,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        active: profile.active,
        registerDate: profile.registerDate
    };
    switch (profile.role){
        case 'ADMIN':
            return {...base, role: profile.role};
        case 'TRAINER':
        case 'HEAD_TRAINER':
            return {...base, role: profile.role, specialty: profile.specialty};
        case 'CLIENT':
            return {...base, role: profile.role, age:profile.age, gender: profile.gender, location: toLocationResponse(profile.location)};
    }
}