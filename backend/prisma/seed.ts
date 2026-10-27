// Datos iniciales de la base de datos

import 'dotenv/config'
import { createPrismaClient } from '../src/infrastructure/database/prisma-client.js'
import { PrismaUserRepository } from '../src/infrastructure/database/repositories/prisma-user-repository.js'
import { BcryptPasswordHasher } from '../src/infrastructure/security/bcrypt-password-hasher.js'

function required(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

const prisma = createPrismaClient(required('DATABASE_URL'));

try{
    //Agregar algunas sedes de ejemplo (solo si la tabla esta vacia)

    if((await prisma.location.count())==0) {
        await prisma.location.createMany({
            data: [
                {name: 'Sede Vedado', address: 'Calle 23 No. 1234, e/ 12 y 14, Vedado, Plaza de la Revolución, La Habana'},
                {name: 'Sede Miramar', address: 'Avenida 5ta No. 5678, e/ 76 y 78, Miramar, Playa, La Habana'}
            ]
        });
        console.log('Sedes de ejemplo creadas')
    }

    //Agregar el primer admin (si no existe ya)
    const email = required('SEED_ADMIN_EMAIL').trim().toLowerCase();
    const users = new PrismaUserRepository(prisma);

    if(!await users.findByEmail(email)){
        const hasher = new BcryptPasswordHasher(12);
        await users.create({
            role:'ADMIN',
            name: required('SEED_ADMIN_NAME'),
            email,
            phone: required('SEED_ADMIN_PHONE'),
            passwordHash: await hasher.hash(required('SEED_ADMIN_PASSWORD')),
        });
        console.log(`Administrador inicial creado: ${email}`)
    }
} finally{
    await prisma.$disconnect();
}
