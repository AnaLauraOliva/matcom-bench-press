import type { IFailureOutputBoundary } from "../../boundaries/failure-output-boundary.js";
import type { IUserResponse } from "../../models/user-response.js";

export type LoginIdentifier = { readonly email: string};

export interface ILoginRequest {
    readonly identifier: LoginIdentifier;
    readonly password: string;
}

export interface ILoginResponse {
    readonly token: string;
    readonly user: IUserResponse;
}

export interface ILoginInputBoundary {
    execute(req: ILoginRequest, output: ILoginOutputBoundary): Promise<void>;
}

export interface ILoginOutputBoundary extends IFailureOutputBoundary{
    presentSuccess(response: ILoginResponse): void;
}