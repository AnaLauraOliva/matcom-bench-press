import type { Role } from "../../domain/entities/role.js";
import type { Sex } from "../../domain/entities/sex.js";
import {
    EmailAlreadyExistsError,
    PermissionDeniedError,
    LocationNotFoundError,
} from '../../domain/errors/domain-errors.js'
import type { RegisterPolicy }from "../../domain/policies/register-policy.js";
import type { ILocationRepository } from "../../domain/repositories/location-repository.js";
import type { IUserRepository } from "../../domain/repositories/user-repository.js";
import { toPublicUser, type IPublicUser } from '../dto/public-user.js';
import type { IPasswordHasher } from "../ports/password-hasher.js";

interface ICommunData {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly password: string;
}

//Los datos para registrar un usuario dependen del rol
export type RegisterData = ICommunData & 
(
    | {
        readonly role: 'CLIENT';
        readonly age: number;
        readonly sex: Sex;
        readonly idLocation: number;
    }
    | {
        readonly role: 'ADMIN';
    }
    | {
        readonly role: 'TRAINER' | 'HEAD_TRAINER';
        readonly specialty: string;
    }
);

export interface IRegisterUserInput {
    //Rol del usuario que quiere registrar a otro usuario, null significa que es un usuario anónimo
    readonly actor: Role | null;
    readonly data: RegisterData;
}

export class RegisterUser {
    constructor(
        private readonly users: IUserRepository,
        private readonly locations: ILocationRepository,
        private readonly hasher: IPasswordHasher,
        private readonly policy: RegisterPolicy
    ) {}
    
    async execute({actor, data}: IRegisterUserInput): Promise<IPublicUser> {
        // Comprobaci'on de permisos
        if (!this.policy.canRegister(actor, data.role)) {
            throw new PermissionDeniedError(actor, data.role);
        }

        // Comprobaci'on de existencia del email
        if (await this.users.findByEmail(data.email)) {
            throw new EmailAlreadyExistsError();
        }

        // Comprobaci'on de existencia de la sede
        if (data.role === 'CLIENT' && !await this.locations.exists(data.idLocation)) {
            throw new LocationNotFoundError(data.idLocation);
        }

        // Hasheamos y guardamos la contraseña
        const {password, ...rest} = data;
        const passwordHash = await this.hasher.hash(password);
        const created = await this.users.create({...rest, passwordHash});

        return toPublicUser(created);
    }
}