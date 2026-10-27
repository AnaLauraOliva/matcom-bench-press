import { z } from 'zod';
import { SEXES } from '../../../domain/entities/sex.js';

const email = z.string().trim().toLowerCase().email('Email inválido');
const newPassword = z.string().min(8,'La contraseña debe tener al menos 8 caracteres').max(72,'La contraseña no puede superar 72 caracteres');

export const loginSchema = z
    .object({
        email: email.optional(),
        name: z.string().trim().min(1, 'El nombre no puede estar vacío').optional(),
        password: z.string().min(1, 'La contraseña es obligatoria'),
    })
    .refine((data) => data.email !== undefined || data.name !== undefined, {
        message: 'Debes enviar "email" o "nombre"',
        path: ['email'],
    });

const common = {
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
    email,
    phone: z.string().trim().min(1, 'El teléfono es obligatorio').max(30),
    password: newPassword,
};

export const registerScheme = z.discriminatedUnion('role', [
    z.object({ ...common, role: z.literal('ADMIN') }),
    z.object({
        ...common,
        role: z.enum(['TRAINER', 'HEAD_TRAINER']),
        specialty: z.string().trim().min(1, 'La especialidad es obligatoria').max(100),
    }),
    z.object({
        ...common,
        role: z.literal('CLIENT'),
        age: z.number().int().positive().max(120),
        sex: z.enum(SEXES),
        locationName: z.string().min(1,'La sede no puede estar vacía'),
    }),
]);