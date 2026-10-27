import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),
    PORT: z.coerce.number().int().positive().default(3000),
    JWT_SECRET: z.string().min(32,'JWT_SECRET debe tener al menos 32 caracteres'),
    JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(3600),
    BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(10),
    //FRONTEND_ORIGIN: z.string().url('FRONTEND_ORIGIN debe ser una URL válida'),
});

const result = schema.safeParse(process.env);

if(!result.success) {
    console.error('Configuración inválida en las variables de entorno:');
    for (const problem of result.error.issues) {
        console.error(`    -${problem.path.join('.')}: ${problem.message}`);
    }
    process.exit(1);
}

export const env = result.data;