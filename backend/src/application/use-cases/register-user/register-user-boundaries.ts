import type { Gender } from "../../../infrastructure/database/generated/enums.js";
import type { Role } from "../../../domain/entities/role.js";
import type { IFailureOutputBoundary } from '../../boundaries/failure-output-boundary.js'
import type { IUserResponse } from "../../models/user-response.js";

interface ICommonRegistrationData {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly password: string;
}

export type RegistrationData = ICommonRegistrationData &
(
    | { readonly role: 'ADMIN'}
    | { readonly role: 'TRAINER' | 'HEAD_TRAINER'; readonly specialty: string}
    | {
        readonly role: 'CLIENT';
        readonly age: number;
        readonly gender: Gender;
        readonly idLocation: number;
    }
);

export interface IRegisterUserRequest {
    readonly actorRole: Role | null;
    readonly data: RegistrationData;
}

export interface IRegisterUserResponse {
    readonly user: IUserResponse;
}

export interface IRegisterUserInputBoundary {
    execute(req: IRegisterUserRequest, output: IRegisterUserOutputBoundary): Promise<void>;
}

export interface IRegisterUserOutputBoundary extends IFailureOutputBoundary {
    presentSuccess(response: IRegisterUserResponse): void;
}