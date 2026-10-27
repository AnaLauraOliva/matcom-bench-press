import type { Role } from "../entities/role.js";

// Tabla de permisos sobre quien puede registrar a quien
// ANONYMOUS es un usuario que no ha iniciado sesión

const CAN_REGISTER: Readonly<Record<Role | 'ANONYMOUS', readonly Role[]>>={
    ANONYMOUS: ['CLIENT'],
    CLIENT: [],
    TRAINER: ['CLIENT'],
    HEAD_TRAINER: ['CLIENT', 'TRAINER'],
    ADMIN: ['CLIENT','TRAINER','HEAD_TRAINER','ADMIN'],
};

export class RegisterPolicy {
    canRegister(actor: Role | null, objetive: Role): boolean {
        const who = actor ?? 'ANONYMOUS';
        return CAN_REGISTER[who].includes(objetive);
    }
}