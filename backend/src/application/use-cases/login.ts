// Caso de uso para el inicio de sesión de usuarios

import type { IUser } from "../../domain/entities/user.js";
import{
    InvalidCredentialsError,
    AmbiguousNameError,
    InactiveUserError

} from "../../domain/errors/domain-errors.js";
import type { IUserRepository } from "../../domain/repositories/user-repository.js";
import type { ITokenService } from "../ports/token-service.js";
import type { IPasswordHasher } from "../ports/password-hasher.js";
import { toPublicUser, IPublicUser } from "../dto/public-user.js";

export type Identificator =  {readonly email: string} |  {readonly name: string};

export interface ILoginInput {
    readonly identificator: Identificator;
    readonly password: string;
}

export interface ILoginOutput {
    readonly user: IPublicUser;
    readonly token: string;
}

export class Login {
    constructor(
        private readonly users: IUserRepository,
        private readonly hasher: IPasswordHasher,
        private readonly tokens: ITokenService
    ) {}
    
    async execute(input: ILoginInput): Promise<ILoginOutput> {
        const user = await this.findUser(input.identificator);
        if (!user) throw new InvalidCredentialsError();

        const sucess = await this.hasher.compare(input.password, user.passwordHash);
        if (!sucess) throw new InvalidCredentialsError();
        if (!user.active) throw new InactiveUserError();

        const token = this.tokens.generate({idUser: user.idUser, role: user.role});
        return {token, user: toPublicUser(user)};
    }

    private async findUser(identificator: Identificator): Promise<IUser | null> {
        if ('email' in identificator) {
            return this.users.findByEmail(identificator.email);
        } 
        
        const matches = await this.users.findByName(identificator.name);
        if (matches.length > 1) throw new AmbiguousNameError();
        return matches[0] ?? null;
    }
}