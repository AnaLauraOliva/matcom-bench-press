import type { ILocation } from "./location.js";
import type { Sex } from "./sex.js";

interface IUserProfileBase {
    readonly idUser: number;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly active: boolean;
    readonly registerDate: Date;
}

export type UserProfile = 
| (IUserProfileBase & {
        readonly role: 'CLIENT';
        readonly age: number;
        readonly sex: Sex;
        readonly location: ILocation;
    })
| (IUserProfileBase &{readonly role: 'ADMIN'})
| (IUserProfileBase &{
        readonly role: 'TRAINER' | 'HEAD_TRAINER';
        readonly specialty: string;
    });