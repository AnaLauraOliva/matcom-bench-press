import type { IFailureOutputBoundary } from "../../boundaries/failure-output-boundary.js";
import type { ITargetUserRequest } from "../../models/target-user-request.js";
import type { UserDetailsResponse } from "../../models/user-details-response.js";

export interface IGetUserResponse {
    readonly user: UserDetailsResponse;
}

export interface IGetUserInputBoundary {
    execute(req: ITargetUserRequest, output: IGetUserOutputBoundary): Promise<void>;
}

export interface IGetUserOutputBoundary extends IFailureOutputBoundary {
    pesentSucess(response: IGetUserResponse): void;
}