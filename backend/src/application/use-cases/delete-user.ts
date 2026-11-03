import type { IUserManagementRepository } from "../../domain/repositories/user-management-repository.js";   
import type { UserAccessGuard } from "../services/user-access-guard.js";
import type { TargetUserInput } from "./target-user-input.js";

export class DeleteUser {
    constructor(
        private readonly accessGuard: UserAccessGuard,
        private readonly userRepository: IUserManagementRepository,
    ){}

    async execute({actor, targetId}: TargetUserInput): Promise<void>{
        await this.accessGuard.ensureCanAccess(actor,targetId);
        await this.userRepository.deleteById(targetId);
    }
}