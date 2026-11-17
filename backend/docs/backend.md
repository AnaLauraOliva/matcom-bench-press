# Documentación del backend

## Documentación de la API

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

## Convenciones HTTP

- Los cuerpos de solicitud y las respuestas con contenido usan `application/json`.
- Los errores usan la forma `{ "error": { "code": "...", "message": "...", "details": [...] } }`. `details` aparece en `INVALID_DATA` y contiene `field` y `message` por cada problema de validación.
- Las rutas protegidas requieren `Authorization: Bearer <token>`. El token se obtiene al iniciar sesión. El registro permite omitirlo para auto-registrar clientes; si se envía, el token debe ser válido.
- `DELETE /api/users/:id` realiza un borrado lógico: anonimiza los datos y conserva la fila para mantener relaciones. `PATCH /api/users/:id/deactivate` solo desactiva la cuenta.
- Si el JSON no se puede interpretar, el backend devuelve `400 MALFORMED_JSON`. Para rutas inexistentes devuelve `404 ROUTE_NOT_FOUND`. Los fallos inesperados devuelven `500 INTERNAL_ERROR` sin exponer detalles internos.

## Módulos implementados

El punto de entrada de desarrollo y producción es `src/config/main.ts`. Construye el contenedor, crea la aplicación Express, escucha en el puerto configurado y cierra Prisma de forma ordenada al recibir SIGINT o SIGTERM.

| Módulo | Responsabilidad | Implementación actual |
| --- | --- | --- |
| `src/domain` | Entidades y políticas del negocio, sin depender de Express o Prisma. | Roles, géneros, usuarios, perfiles, sedes, permisos de registro y acceso. |
| `src/application` | Casos de uso y contratos de gateways/presenters. | Inicio de sesión, registro, listado de sedes, consulta, desactivación y eliminación de usuarios. |
| `src/interfaces` | Adaptadores HTTP, validación, presentación y conexión de contratos. | Controladores, esquemas Zod, presenters, gateways, sesión Bearer y formato de errores. |
| `src/infrastructure` | Integración con tecnologías externas. | Express 5, middleware CORS/JSON y adaptadores Prisma/PostgreSQL. |
| `src/config` | Configuración y ensamblaje de dependencias. | Validación del entorno y composición del contenedor de la aplicación. |
| `prisma` | Modelo relacional, migraciones y datos iniciales. | Usuarios, roles, sedes y entidades del dominio de entrenamiento. |

### Reglas de acceso vigentes

Una persona autenticada puede consultar, desactivar o eliminar su propia cuenta. Para operar sobre otra cuenta se aplica la política de registro entre roles: `ADMIN` puede operar sobre todos los roles; `HEAD_TRAINER` sobre `CLIENT` y `TRAINER`; `TRAINER` sobre `CLIENT`; `CLIENT` no puede operar sobre otros usuarios. El sistema impide desactivar o eliminar al último administrador activo.

El registro anónimo solo admite el rol `CLIENT`. Las personas autenticadas pueden registrar los roles permitidos por su política. El registro de un cliente requiere una sede existente.

### Persistencia e integraciones

Prisma genera el cliente en `src/infrastructure/database/generated` y usa el adaptador PostgreSQL. Las interfaces `IUserGateway`, `IUserProfileGateway` e `ILocationGateway` mantienen los casos de uso independientes del almacenamiento. El backend también usa `bcrypt` para hashes de contraseñas y JWT para sesiones.

La aplicación activa expone actualmente autenticación, sedes y operaciones de usuarios. El esquema Prisma contiene más entidades relacionadas con programas, rutinas y ejercicios que todavía no tienen rutas en esta aplicación OpenAPI. El archivo raíz `app.ts` contiene un router de ejercicios de ejemplo separado del punto de entrada configurado por `npm run dev`.

## Configuración

Las variables obligatorias y sus validaciones están definidas en `src/config/env.ts`:

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión a PostgreSQL. |
| `JWT_SECRET` | Secreto para firmar y verificar tokens; mínimo 32 caracteres. |
| `FRONTEND_ORIGIN` | Origen permitido por CORS. |
| `PORT` | Puerto HTTP; valor predeterminado `3000`. |
| `JWT_EXPIRES_IN_SECONDS` | Duración del token; valor predeterminado `3600`. |
| `BCRYPT_ROUNDS` | Coste de bcrypt; valor predeterminado `10`, rango `10–15`. |

## Comandos del backend

Desde `backend/`:

```bash
npm run dev
npm run build
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
