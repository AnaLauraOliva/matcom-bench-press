import { buildContainer } from '../../config/container.js';
import { env } from '../../config/env.js';
import { createApp } from './create-app.js';

const container = buildContainer();
const app = createApp(container);

const server = app.listen(env.PORT, () => {
    console.log(`Servidor listo en http://localhost:${env.PORT}`);
});

async function turnoff(): Promise<void>{
    server.close();
    await container.prisma.$disconnect();
    process.exit(0);
}

process.on('SIGINT', () => void turnoff());
process.on('SIGTERM', () => void turnoff());
