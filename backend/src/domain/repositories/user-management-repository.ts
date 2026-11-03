import type { UserProfile } from "../entities/user-profile.js";
export interface IUserManagementRepository {
    findProfileById(id: number): Promise<UserProfile | null>

    deleteById(id: number): Promise<void>;
}