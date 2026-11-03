import type { UserProfile } from "../../../domain/entities/user-profile.js";
import { UserNotFoundError } from "../../../domain/errors/domain-errors.js";
import type { IUserManagementRepository } from "../../../domain/repositories/user-management-repository.js";
import type { PrismaClient } from "../prisma-client.js";
import { INCLUDE_PROFILE, toUserProfile } from "./user-profile-mapper.js";

function isRecordNotFound(error: unknown): boolean {
    return typeof error === 'object' && error != null && 'code' in error && error.code === 'P2025';
}

export class PrismaUserManagementRepository implements IUserManagementRepository {
    constructor(private readonly prisma: PrismaClient){}
    async findProfileById(id: number): Promise<UserProfile | null> {
        const row = await this.prisma.user.findUnique({
            where: {idUser: id},
            include: INCLUDE_PROFILE,
        });
        return row ? toUserProfile(row) : null;
    }

    async deleteById(id: number): Promise<void> {
        
    }

    private async runOrThrowNotFound( idUser: number, operation: ()=> Promise<unknown>): Promise<void>{
        try {
            await operation();
        } catch(error){
            if(isRecordNotFound(error)) throw new UserNotFoundError(idUser);
            throw error;
        }
    }
}