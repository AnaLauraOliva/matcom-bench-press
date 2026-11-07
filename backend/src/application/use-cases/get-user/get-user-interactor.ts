import { toUserDetailsResponse } from "../../models/user-details-response.js";
import type { ITargetUserRequest } from "../../models/target-user-request.js";
import type { UserAccessChecker } from "../../services/user-access-checker.js";
import type { IGetUserInputBoundary, IGetUserOutputBoundary } from "./get-user-boundaries.js";

export class GetUserInteractor implements IGetUserInputBoundary {
    constructor(private readonly accessChecker: UserAccessChecker){}
    async execute(req: ITargetUserRequest, output: IGetUserOutputBoundary): Promise<void> {
        const access = await this.accessChecker.check(req.actor, req.targetUserId);
        if(!access.granted) {
            output.presentFailure(access.failure);
            return;
        }

        output.presentSuccess({user: toUserDetailsResponse(access.profile)});
    }
}