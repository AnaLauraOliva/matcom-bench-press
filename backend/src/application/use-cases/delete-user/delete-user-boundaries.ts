import type { IFailureOutputBoundary } from "../../boundaries/failure-output-boundary.js";
import type { ITargetUserRequest } from "../../models/target-user-request.js";

export interface IDeleteUserInputBoundary {
    execute(req: ITargetUserRequest, output: IDeleteUserOutputBoundary): Promise<void>;
}

export interface IDeleteUserOutputBoundary  extends IFailureOutputBoundary{
    presentSuccess():void
}