import type { Role } from "../../domain/entities/role.js";
//Contrato para fabricar y verificar tokens de acceso
export interface IPayloadToken {
    readonly idUser: number;
    readonly role: Role;
}

export interface ITokenService {
    generate(payload: IPayloadToken): string;
    verify(token: string): IPayloadToken;
}