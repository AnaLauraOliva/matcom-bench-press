// Definir el sexo del cliente, coincide con el enum de prisma
export const SEXES = ['FEMENINO', 'MASCULINO', 'OTRO'] as const

export type Sex = (typeof SEXES)[number];