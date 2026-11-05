import type { UserProfile } from "../../domain/entities/user-profile.js";

export interface IUserProfileGateway {
    findProfileById(idUser: number): Promise<UserProfile | null>

    deleteById(idUser: number): Promise<boolean>;

    deactivateById(idUser: number): Promise<boolean>;
}