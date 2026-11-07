import type { Role } from "../../domain/entities/role.js";
import type { NewUser, IUser } from "../../domain/entities/user.js";
import type { IUserGateway } from "../../application/gateways/user-gateway.js";
import type {
    NewUserRecord,
    IUserDataSource,
    IUserRecord,
} from "../data-sources/user-data-source.js";
// El rol no se guarda como un dato: se deduce de en qué tabla aparece el usuario.
function deriveRole(record: IUserRecord): Role {
    if (record.isAdmin) return "ADMIN";
    if (record.isTrainer)
        return record.isTrainer.isHeadTrainer ? "HEAD_TRAINER" : "TRAINER";
    if (record.isClient) return "CLIENT";
    throw new Error(
        `El usuario ${record.idUser} no tiene ningún rol asociado (datos inconsistentes).`,
    );
}
function toUser(record: IUserRecord): IUser {
    return {
        idUser: record.idUser,
        phone: record.phone,
        registerDate: record.registerDate,
        active: record.active,
        name: record.name,
        email: record.email,
        passwordHash: record.passwordHash,
        role: deriveRole(record),
    };
}
// Decide en qué tabla hay que guardar a cada usuario según su rol.
function toNewUserRecord(newUser: NewUser): NewUserRecord {
    const base = {
        phone: newUser.phone,
        name: newUser.name,
        email: newUser.email,
        passwordHash: newUser.passwordHash,
    };
    switch (newUser.role) {
        case "ADMIN":
            return { ...base, role: "admin" };
        case "TRAINER":
            return {
                ...base,
                role: "trainer",
                specialty: newUser.specialty,
                isHeadTrainer: false,
            };
        case "HEAD_TRAINER":
            // Un jefe de sala es un entrenador marcado como jefe.
            return {
                ...base,
                role: "trainer",
                specialty: newUser.specialty,
                isHeadTrainer: true,
            };
        case "CLIENT":
            return {
                ...base,
                role: "client",
                age: newUser.age,
                gender: newUser.gender,
                idLocation: newUser.idLocation,
            };
    }
}
export class UserGatewayImpl implements IUserGateway {
    constructor(private readonly dataSource: IUserDataSource) {}
    async findByEmail(email: string): Promise<IUser | null> {
        const record = await this.dataSource.findByEmail(email);
        return record ? toUser(record) : null;
    }
    async create(newUser: NewUser): Promise<IUser> {
        const record = await this.dataSource.insert(toNewUserRecord(newUser));
        return toUser(record);
    }
}
