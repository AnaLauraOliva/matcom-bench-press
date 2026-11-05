import type { UserProfile } from "../../domain/entities/user-profile.js";
import type { IUserProfileGateway } from "../../application/gateways/user-profile-gateway.js";
import type {
    IUserProfileDataSource,
    IUserProfileRecord,
} from "../data-sources/user-profile-data-source.js";
// Construye la ficha correcta según en qué tabla de rol aparece el usuario.
function toUserProfile(record: IUserProfileRecord): UserProfile {
    const base = {
        idUser: record.idUser,
        name: record.name,
        email: record.email,
        phone: record.phone,
        active: record.active,
        registerDate: record.registerDate,
    };
    if (record.isAdmin) {
        return { ...base, role: "ADMIN" };
    }
    if (record.trainer) {
        return {
            ...base,
            role: record.trainer.isHeadTrainer ? "HEAD_TRAINER" : "TRAINER",
            specialty: record.trainer.specialty,
        };
    }
    if (record.client) {
        return {
            ...base,
            role: "CLIENT",
            age: record.client.age,
            gender: record.client.gender,
            location: {
                idLocation: record.client.location.id,
                name: record.client.location.name,
                address: record.client.location.address
            },
        };
    }
    throw new Error(
        `El usuario ${record.idUser} no tiene ningún rol asociado (datos inconsistentes).`,
    );
}
export class UserProfileGatewayImpl implements IUserProfileGateway {
    constructor(private readonly dataSource: IUserProfileDataSource) {}
    async findProfileById(userId: number): Promise<UserProfile | null> {
        const record = await this.dataSource.findById(userId);
        return record ? toUserProfile(record) : null;
    }
    deleteById(userId: number): Promise<boolean> {
        return this.dataSource.deleteById(userId);
    }
    deactivateById(userId: number): Promise<boolean> {
        return this.dataSource.deactivateById(userId);
    }
}
