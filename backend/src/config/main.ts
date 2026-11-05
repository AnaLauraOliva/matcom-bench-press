import { createExpressApp } from "../infrastructure/web/create-express-app.js";
import { createContainer } from "./container.js";
import { env } from "./env.js";
const container = createContainer();
const app = createExpressApp(container.controllers);
const server = app.listen(env.PORT, () => {
    console.log(`Servidor listo en http://localhost:${env.PORT}`);
});
// Cierre ordenado: se deja de aceptar peticiones y se suelta la conexión a la base de datos.
async function shutdown(): Promise<void> {
    server.close();
    await container.prisma.$disconnect();
    process.exit(0);
}
process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
