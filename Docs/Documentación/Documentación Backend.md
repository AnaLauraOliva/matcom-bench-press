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
| `npm run mongo:seed` | Carga las estructuras de rutina en MongoDB desde `backend/scripts/seed-data/routine-structures.ts`. |

## Documentación de la API (Swagger / OpenAPI)

Con el backend en ejecución, la especificación interactiva está en:

- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI 3.1 en JSON: `http://localhost:3000/openapi.json`

La especificación describe las rutas que se montan en Express, parámetros, autenticación, cuerpos JSON, respuestas de éxito, errores y ejemplos. Los cuerpos de entrada se convierten desde los esquemas Zod que también validan las solicitudes.

### Cómo mantenerla al día

`src/interfaces/http/api-routes.ts` es la lista única de rutas de la aplicación actual. `create-express-app.ts` usa esa lista para registrar los handlers y `openapi.ts` para construir OpenAPI al iniciar el proceso. Una ruta añadida a la aplicación se declara en ese registro con su controlador, método, path, descripción y respuestas.

Al crear o modificar un endpoint:

1. Actualiza el esquema Zod de entrada en `src/interfaces/validators/` y así el formato del cuerpo se refleja automáticamente en OpenAPI.
2. Añade o modifica la entrada correspondiente en `API_ROUTES` con el controlador y la información de éxito y errores.
3. Actualiza los esquemas y ejemplos de respuesta en `openapi.ts` si cambia el JSON que presenta el controlador.
4. Reinicia el servidor y revisa `/api-docs` y `/openapi.json`.

Los cambios en las rutas montadas y los validadores de entrada se reflejan automáticamente. Las descripciones de reglas de negocio, respuestas y errores son metadatos intencionales: deben cambiarse junto con el comportamiento de los controladores y casos de uso.

### Convenciones HTTP

- Los cuerpos de solicitud y las respuestas con contenido usan `application/json`.
- Los errores usan la forma `{ "error": { "code": "...", "message": "...", "details": [...] } }`. `details` aparece en `INVALID_DATA` y contiene `field` y `message` por cada problema de validación.
- Las rutas protegidas requieren `Authorization: Bearer <token>`. El token se obtiene al iniciar sesión. El registro permite omitirlo para auto-registrar clientes; si se envía, el token debe ser válido.
- `DELETE /api/users/:id` realiza un borrado lógico: anonimiza los datos y conserva la fila para mantener relaciones. `PATCH /api/users/:id/deactivate` solo desactiva la cuenta.
- Si el JSON no se puede interpretar, el backend devuelve `400 MALFORMED_JSON`. Para rutas inexistentes devuelve `404 ROUTE_NOT_FOUND`. Los fallos inesperados devuelven `500 INTERNAL_ERROR` sin exponer detalles internos.

## Relación con el resto del proyecto

El backend expone la API que consume el frontend (ver `docs/Documentación/Documentación Frontend.md`), utiliza PostgreSQL como base de datos relacional (ver `docs/Documentación/Documentación Base de Datos.md`) y MongoDB para las estructuras variables de las rutinas (ver la sección de MongoDB en dicha documentación). Para levantar todo el proyecto de una sola vez, usa los comandos descritos en el `README.md` de la raíz (`make start` en Linux o `.\dev.ps1 start` en Windows).
