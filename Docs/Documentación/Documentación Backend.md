# Documentación Backend

API REST del proyecto **matcom-bench-press**, construida con Node.js 24.21.0, Express 5 y TypeScript. Expone endpoints para la gestión de usuarios, ejercicios, rutinas, programas de entrenamiento, entrenadores, clientes y sus inscripciones.

## Arquitectura

Para hacer este proyecto se decidió utilizar la arquitectura limpia siguiendo el marco teórico propuesto por Martin en su libro "Clean Architecture: A Craftsman’s Guide to Software Structure and Design", organizando el código en cuatro círculos concéntricos:

1. Domain
2. Application
3. Interfaces
4. Infrastructure

Con esta selección se pretendía lograr la separación de responsabilidades, la independencia de las reglas de negocio respecto a frameworks y tecnologías, un bajo acoplamiento entre componentes, facilidad para sustituir implementaciones externas y mayor facilidad para probar los casos de uso. Así, las reglas de negocio no dependen de Express, Prisma o PostgreSQL.

### Breve explicación de las capas

#### Domain

Su responsabilidad es representar los conceptos fundamentales del negocio y sus reglas, independientemente de la infraestructura.

#### Application

Se encarga de coordinar las operaciones del sistema y aplicar las reglas necesarias para ejecutar y aplicar las reglas necesarias para ejecutar cada caso de uso.

#### Interfaces

Adapatan los datos de entrada y salida para que los componentes externos puedan comunicarse con los casos de uso (Application).

Los controllers reciben y procesan las solicitudes, los presenters construyen las respuestas que se devolverán al cliente, los gateways implementan los contratos de acceso definidos por Application y los Data Sources definen las operaciones de acceso a los datos que necesitan los adaptadores de persistencia.

## Patrones usados hasta el momento

### Utilizados

- **Adapter**: Se usa en los adaptadores que conectan los contratos internos con tecnologías externas.
- **Template Method**: Se usa en TargetUserController, que define el procedimiento general de atención de una petición y delega un paso variable en las subclases mediante el método abstracto `run()`.
- **Data Mapper**: Se realizan transformaciones explícitas entre los registros de Prisma, los registros intermedios y las entidades que utilizan la aplicación.

## Instalación

Desde la carpeta `backend`:

```bash
npm install
```

El script `postinstall` ejecuta automáticamente `prisma generate` para crear el cliente de Prisma.

## Variables de entorno

Crea un archivo `.env` en la carpeta `backend` a partir de `backend/.env.example`:

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL (ej. `postgresql://user:password@localhost:5432/database`). |
| `PORT` | Puerto en el que escucha la API (por defecto `3000`). |
| `FRONTEND_ORIGIN` | Origen del frontend para CORS (ej. `http://localhost:5173`). |
| `JWT_SECRET` | Secreto para firmar tokens JWT (mínimo 32 caracteres). |
| `JWT_EXPIRES_IN_SECONDS` | Tiempo de expiración del token en segundos (por defecto `3600`). |
| `BCRYPT_ROUNDS` | Rondas de bcrypt para hashear contraseñas (entre 10 y 15, por defecto `10`). |

## Cómo levantar el backend

Desde la carpeta `backend`:

```bash
npm run dev
```

El servidor escuchará en `http://localhost:3000` (o el puerto configurado en `PORT`).

Si usas los comandos globales del proyecto (`make start` en Linux o `.\dev.ps1 start` en Windows), el backend se levanta automáticamente en una terminal separada junto con la base de datos y el frontend.

## Comandos útiles

Desde la carpeta `backend`:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Inicia el servidor en modo desarrollo con `tsx watch`. |
| `npm run build` | Compila TypeScript a JavaScript. |
| `npm run start` | Inicia el servidor en modo producción. |
| `npm run typecheck` | Verifica tipos de TypeScript sin emitir archivos. |
| `npm run prisma:generate` | Genera el cliente de Prisma a partir del schema. |
| `npm run prisma:migrate` | Aplica migraciones pendientes a la base de datos. |
| `npm run prisma:seed` | Carga los datos de ejemplo definidos en `prisma/seed.ts`. |
| `npm run prisma:studio` | Abre Prisma Studio para explorar la base de datos. |

## Relación con el resto del proyecto

El backend expone la API que consume el frontend (ver `docs/Documentación/Documentación Frontend.md`) y utiliza PostgreSQL como base de datos relacional (ver `docs/Documentación/Documentación Base de Datos.md`). Para levantar todo el proyecto de una sola vez, usa los comandos descritos en el `README.md` de la raíz (`make start` en Linux o `.\dev.ps1 start` en Windows).
