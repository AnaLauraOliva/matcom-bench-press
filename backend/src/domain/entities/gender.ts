// Definir el sexo del cliente, coincide con el enum de prisma
export const GENDERS = ['FEMENINO', 'MASCULINO', 'OTRO'] as const

export type Gender = (typeof GENDERS)[number];