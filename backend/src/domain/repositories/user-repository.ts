import type { NewUser, IUser } from "../entities/user.js";

export interface IUserRepository {
    create(user: NewUser): Promise<IUser>;
    findByName(name: string): Promise<IUser[]>;
    findByEmail(email: string): Promise<IUser | null>;
}