//Archivo de configuración de prisma, aquí se declara la dirección de la base de datos
import 'dotenv/config'
import {defineConfig, env} from 'prisma/config'

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx prisma/seed.ts'
    },
    datasource:{
        url: env('DATABASE_URL')
    }
})