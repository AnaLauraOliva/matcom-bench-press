import type { IFailureOutputBoundary } from "../../boundaries/failure-output-boundary.js";
import type { ITargetUserRequest } from "../../models/target-user-request.js";
export interface IDeactivateUserInputBoundary {
    execute(
        req: ITargetUserRequest,
        output: IDeactivateUserOutputBoundary,
    ): Promise<void>;
}
export interface IDeactivateUserOutputBoundary extends IFailureOutputBoundary {
    presentSuccess(): void;
}
