import { toUserDto, type UserDTO } from "../dto/user-dto.js";
import type { UserAccessGuard } from "../services/user-access-guard.js";
import type { TargetUserInput } from "./target-user-input.js";

export class GetUser {
    constructor(private readonly accessGuard: UserAccessGuard) {}

    async execute({actor, targetId}: TargetUserInput): Promise<UserDTO> {
        const profile = await this.accessGuard.ensureCanAccess(actor, targetId);
        return toUserDto(profile);
    }
}