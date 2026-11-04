import type { UserProfile } from "../../domain/entities/user-profile.js";

export interface IUserProfileGateway {
    findProfileById(idUser: number): Promise<UserProfile | null>

    deleteById(idUser: number): Promise<void>;

    deactivateById(idUser: number): Promise<void>;
}