import { z } from "zod";
import { GENDERS } from "../../domain/entities/gender.js";

const email = z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido")
    .describe("Email de la cuenta; se quitan espacios y se convierte a minúsculas.");
const newPassword = z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede superar 72 caracteres")
    .describe("Contraseña nueva, entre 8 y 72 caracteres.");

export const loginSchema = z
    .object({
        email: email,
        password: z
            .string()
            .min(1, "La contraseña es obligatoria")
            .describe("Contraseña de la cuenta."),
    })
    .refine((data) => data.email !== undefined, {
        message: 'Debes enviar "email"',
        path: ["email"],
    });

const common = {
    name: z
        .string()
        .trim()
        .min(1, "El nombre es obligatorio")
        .max(100)
        .describe("Nombre; se quitan espacios al inicio y al final (máximo 100 caracteres)."),
    email,
    phone: z
        .string()
        .trim()
        .min(1, "El teléfono es obligatorio")
        .max(30)
        .describe("Teléfono de contacto (máximo 30 caracteres)."),
    password: newPassword,
};

export const registerSchema = z.discriminatedUnion("role", [
    z.object({
        ...common,
        role: z.literal("ADMIN").describe("Cuenta administradora."),
    }),
    z.object({
        ...common,
        role: z
            .enum(["TRAINER", "HEAD_TRAINER"])
            .describe("Cuenta de entrenador o jefe de sala."),
        specialty: z
            .string()
            .trim()
            .min(1, "La especialidad es obligatoria")
            .max(100)
            .describe("Especialidad del entrenador (máximo 100 caracteres)."),
    }),
    z.object({
        ...common,
        role: z.literal("CLIENT").describe("Cuenta de cliente."),
        age: z.number().int().positive().max(120).describe("Edad en años (1–120)."),
        gender: z.enum(GENDERS).describe("Género del cliente."),
        idLocation: z.int().positive().describe("ID de una sede existente."),
    }),
]);

export type RegisterBody = z.infer<typeof registerSchema>;
