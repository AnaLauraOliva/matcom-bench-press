import type { Gender } from "../../domain/entities/gender.js";
import type { UserProfile } from "../../domain/entities/user-profile.js";
import { toLocationDto, type ILocationDTO } from "./location-dto.js";

interface IUserDTOBase {
    readonly id:number;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly active: boolean;
    readonly registerDate: Date;
}

export type UserDTO = 
| (IUserDTOBase & {readonly role: 'ADMIN'})
| (IUserDTOBase & {
    readonly role: 'TRAINER' | 'HEAD_TRAINER';
    readonly specialty: string;
})
| (IUserDTOBase & {
    readonly role: 'CLIENT';
    readonly age: number;
    readonly gender: Gender;
    readonly location: ILocationDTO;
})

export function toUserDto(profile: UserProfile): UserDTO{
    const base = {
        id: profile.idUser,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        active: profile.active,
        registerDate: profile.registerDate,
    };

    switch (profile.role) {
        case 'ADMIN':
            return {
                ...base, 
                role: profile.role
            };
        case 'HEAD_TRAINER':
            return {
                ...base, 
                role: profile.role, 
                specialty: profile.specialty
            };
        case 'TRAINER':
            return {
                ...base, 
                role: profile.role, 
                specialty: profile.specialty
            };
        case 'CLIENT':
            return {
                ...base, 
                role: profile.role, 
                age: profile.age,
                gender: profile.gender,
                location: toLocationDto(profile.location),
            }
    }
}