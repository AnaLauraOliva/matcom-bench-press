import type { NewUser, IUser } from "../../domain/entities/user.js";

export interface IUserGateway {
    findByEmail (email: string): Promise<IUser | null>;

    create(newUser: NewUser): Promise<IUser>;
}