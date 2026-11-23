# matcom-bench-press

Proyecto de las asignaturas Bases de Datos II e Ingeniería de Software, curso 2026-2027.

## Descripción del proyecto

Aplicación web para gestionar la generación automática de planes de entrenamiento en un gimnasio. El sistema cubre la gestión de ejercicios, programas de entrenamiento, entrenadores, jefes de sala, clientes y sus inscripciones; la generación, revisión y aprobación de rutinas; la asignación de rutinas y el registro de sesiones; el seguimiento del progreso y las solicitudes de ajuste; y la producción de reportes sobre rutinas, ejercicios, rendimiento, finalización y abandono, con ordenación y exportación a PDF.

## Stack tecnológico

| Capa | Tecnología | Para qué se usa |
| --- | --- | --- |
| Frontend | React 19 y TypeScript | Interfaz de usuario y tipado de los datos. |
| Frontend | Vite 8 | Servidor de desarrollo y empaquetado de la aplicación. |
| Frontend | Tailwind CSS 4 | Estilos |
| Backend | Node.js 24.21.0, Express 5 y TypeScript | API REST, validación de entradas y reglas de negocio. |
| ORM | Prisma 7 | Operaciones CRUD, migraciones y datos de ejemplo sobre PostgreSQL. |
| Base de datos relacional | PostgreSQL 17 | Persistencia de la información del negocio (usuarios, roles, ejercicios, rutinas, programas, asignaciones, sesiones). |
| Base de datos documental | MongoDB 8.0 | Estructuras variables de las rutinas (bloques, ejercicios, circuitos anidados, repeticiones y descansos). |
| Documentación de API | Swagger UI / OpenAPI 3.1 | Especificación interactiva de los endpoints en `/api-docs` y `/openapi.json`. |
| Entorno local | Docker Compose | Levanta y detiene los contenedores de PostgreSQL y MongoDB. |
| Diseño | Clean Architecture y patrones Adapter, Template Method y Data Mapper | Separación de responsabilidades; detalles en `docs/Documentación/Documentación Backend.md`. |
| Planificación | Trello | Seguimiento de las tareas del equipo. |

## Requisitos previos

- Node.js 24.21.0 y npm. Si usas nvm, ejecuta `nvm use` en la raíz (lee `.nvmrc`).
- Docker con Docker Compose v2. Los comandos usan `docker compose up -d --wait`, que espera a que PostgreSQL esté listo.
- Git y acceso al repositorio.

## Variables de entorno

Antes de usar los comandos, crea los archivos `.env` a partir de los ejemplos y rellénalos:

| Archivo | Crearlo con | Configura |
| --- | --- | --- |
| `.env` (raíz) | `cp .env.example .env` | Usuario, contraseña, base de datos y puerto de PostgreSQL para Docker Compose. |
| `backend/.env` | `cp backend/.env.example backend/.env` | `DATABASE_URL`, puerto del API, origen del CORS, JWT, bcrypt y `MONGODB_URI` para MongoDB. |
| `frontend/.env` | `cp frontend/.env.example frontend/.env` | URL de la API y si se usan repositorios mock. |

En Windows, sustituye `cp` por `Copy-Item`, por ejemplo: `Copy-Item .env.example .env`.

El valor de `JWT_SECRET` debe tener al menos 32 caracteres. En el frontend también se admite `.env.local` en lugar de `.env`.

## Comandos

Ejecuta siempre desde la raíz del repositorio. `start` deja backend y frontend corriendo en terminales separadas. `stop` detiene esos procesos y baja el contenedor, pero **conserva la estructura y los datos** de PostgreSQL. No es lo mismo que `reset`; la diferencia se explica en [¿Qué pasa con la base de datos?](#qué-pasa-con-la-base-de-datos).

### Linux (`Makefile`)

| Comando | Qué hace | Sustituye a |
| --- | --- | --- |
| `make help` | Muestra la lista de comandos. | Leer esta sección. |
| `make install` | Instala las dependencias de backend y frontend. | `cd backend && npm install` y `cd frontend && npm install`. El `postinstall` de backend ya genera el cliente de Prisma. |
| `make start` | Levanta PostgreSQL, backend y frontend. | `docker compose up -d`, `cd backend && npm run dev` y `cd frontend && npm run dev` en dos terminales. |
| `make stop` | Apaga backend, frontend, PostgreSQL y MongoDB. | Cerrar las dos terminales de desarrollo y ejecutar `docker compose down`. |
| `make db-migrate` | Aplica las migraciones pendientes de Prisma. | `cd backend && npm run prisma:migrate` (`prisma migrate dev`). Con el historial actual aplica las migraciones existentes sin preguntar; solo pedirá nombre si hay cambios nuevos en `schema.prisma`. |
| `make db-seed` | Carga en todas las tablas los datos de ejemplo definidos en `backend/prisma/seed.ts`. | `cd backend && npm run prisma:seed`. |
| `make mongo-seed` | Carga las estructuras de rutina en MongoDB desde `backend/scripts/seed-data/routine-structures.ts`. | `cd backend && npm run mongo:seed`. |
| `make db-studio` | Abre Prisma Studio para explorar la base de datos. | `cd backend && npm run prisma:studio`. |
| `make check` | Verifica tipos, lint y compilación de ambos proyectos. | `npm run typecheck` y `npm run build` en backend, y `npm run lint` y `npm run build` en frontend. |
| `make reset` | **Destructivo.** Borra la BD completa (estructura y datos de PostgreSQL y MongoDB), las reconstruye desde las migraciones y vuelve a cargar los seeds. Ver [¿Qué pasa con la base de datos?](#qué-pasa-con-la-base-de-datos). | `make stop`, `docker compose down -v`, `make start`, `make db-migrate`, `make db-seed` y `make mongo-seed`. |

### Windows (`dev.ps1`)

Los mismos comandos se escriben como argumentos de un único script:

```powershell
.\dev.ps1 install
.\dev.ps1 start
.\dev.ps1 stop
```

| Comando | Equivalente en Linux | Sustituye a |
| --- | --- | --- |
| `.\dev.ps1 help` | `make help` | Leer esta sección. |
| `.\dev.ps1 install` | `make install` | `cd backend; npm install` y `cd frontend; npm install`. |
| `.\dev.ps1 start` | `make start` | `docker compose up -d` y `npm run dev` en backend y frontend en dos terminales. |
| `.\dev.ps1 stop` | `make stop` | Cerrar las terminales y `docker compose down` (detiene PostgreSQL y MongoDB). |
| `.\dev.ps1 db-migrate` | `make db-migrate` | `cd backend; npm run prisma:migrate`. |
| `.\dev.ps1 db-seed` | `make db-seed` | `cd backend; npm run prisma:seed`. |
| `.\dev.ps1 mongo-seed` | `make mongo-seed` | `cd backend; npm run mongo:seed`. |
| `.\dev.ps1 db-studio` | `make db-studio` | `cd backend; npm run prisma:studio`. |
| `.\dev.ps1 check` | `make check` | Typecheck y build de backend, y lint y build de frontend. |
| `.\dev.ps1 reset` | `make reset` | Apagar, `docker compose down -v`, levantar, migrar y sembrar PostgreSQL y MongoDB (borra la estructura y los datos; ver la sección siguiente). |

Si PowerShell bloquea el script, permite su ejecución con `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

### ¿Qué pasa con la base de datos?

Docker Compose levanta dos servicios de base de datos: **PostgreSQL** (volumen `postgres_data`) y **MongoDB** (volumen `mongo-data`). Cada volumen contiene todo su cluster respectivo. Por eso conviene distinguir estos dos comandos:

| Comando | Volúmenes | Estructura en las BD | Datos |
| --- | --- | --- | --- |
| `stop` (`docker compose down`) | Se conservan | Intactas | Intactos |
| `reset` (`docker compose down -v`) | Se eliminan | Se borran y se recrean | Se borran y se recargan |

`reset` reconstruye las bases de datos a partir de lo que está versionado en el repositorio:

1. Elimina los volúmenes y levanta PostgreSQL y MongoDB vacíos con los usuarios y bases de datos configurados en `.env`.
2. `db-migrate` vuelve a crear todas las tablas de PostgreSQL aplicando los archivos de `backend/prisma/migrations/`. `backend/prisma/schema.prisma` es la fuente de verdad de ese diseño relacional.
3. `db-seed` rellena **todas** las tablas de PostgreSQL con los datos de ejemplo de `backend/prisma/seed.ts`: sedes, usuarios (administradores, entrenadores y clientes), jefe de sala, tipos de ejercicio, grupos musculares, ejercicios, programas, rutinas, validaciones, asignaciones, sesiones y solicitudes de ajuste.
4. `mongo-seed` carga las estructuras de rutina en MongoDB desde `backend/scripts/seed-data/routine-structures.ts`.

Al terminar, al abrir las BD verás tablas y documentos de demostración. En cambio, **se pierde todo lo que no esté en las migraciones ni en los seeds**: usuarios o rutinas creados al probar, sesiones registradas, estructuras de rutina creadas manualmente en MongoDB y cualquier cambio hecho directamente en las bases de datos. Usa `reset` solo cuando quieras partir de cero; en el día a día usa `stop`.

Si `db-seed` o `mongo-seed` fallan a mitad de proceso, puede quedar una BD con tablas o colecciones vacías o parcialmente llenas, porque los seeds insertan registro por registro. Revisa la salida del comando antes de darlo por bueno.

### Flujo habitual

#### Primera vez que usas el proyecto

Ejecuta estos pasos en orden desde la raíz del repositorio:

1. **Crea los archivos de entorno** a partir de los ejemplos y edítalos con los valores de tu máquina:

   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edita los tres archivos .env con los valores del entorno
   ```

   En Windows usa `Copy-Item` en lugar de `cp`.

2. **Instala las dependencias** de backend y frontend:

   ```bash
   make install      # Windows: .\dev.ps1 install
   ```

3. **Levanta los servicios** (PostgreSQL, MongoDB, backend y frontend):

   ```bash
   make start        # Windows: .\dev.ps1 start
   ```

   Esto abre dos terminales (una para el backend y otra para el frontend) y deja los contenedores de base de datos corriendo en segundo plano.

4. **Aplica las migraciones** para crear las tablas de PostgreSQL:

   ```bash
   make db-migrate   # Windows: .\dev.ps1 db-migrate
   ```

5. **Carga los datos de ejemplo** (opcional pero recomendado la primera vez):

   ```bash
   make db-seed      # Windows: .\dev.ps1 db-seed
   make mongo-seed   # Windows: .\dev.ps1 mongo-seed
   ```

   `db-seed` rellena las tablas de PostgreSQL con sedes, usuarios, ejercicios, rutinas, etc. `mongo-seed` carga las estructuras de rutina en MongoDB. Si no los ejecutas, las bases de datos quedarán vacías.

#### Después de la primera vez (día a día)

Ya no necesitas instalar dependencias ni aplicar migraciones salvo que el esquema haya cambiado. Solo usa:

```bash
make start      # Windows: .\dev.ps1 start   # al empezar a trabajar
make stop       # Windows: .\dev.ps1 stop    # al terminar
```

- `start` levanta de nuevo PostgreSQL, MongoDB, backend y frontend. Los datos que ya hayas creado se conservan (los volúmenes de Docker no se borran).
- `stop` detiene todo pero **conserva los datos** de ambas bases de datos.

Si necesitas partir de cero (borrar todo y volver a cargar los datos de ejemplo desde cero), usa `make reset` (o `.\dev.ps1 reset`), pero ten en cuenta que es **destructivo**: elimina todos los datos creados y los vuelve a cargar desde los seeds.

Servicios tras `start`:

| Servicio | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| API backend | http://localhost:3000 |
| Documentación API (Swagger UI) | http://localhost:3000/api-docs |
| OpenAPI JSON | http://localhost:3000/openapi.json |
| PostgreSQL | `localhost:5432` (o el puerto configurado en `.env`) |
| MongoDB | `localhost:27017` (o el puerto configurado en `MONGO_PORT`) |

### Visualizar las bases de datos

No es necesario instalar ninguna herramienta cliente en tu máquina. Ambas bases de datos corren dentro de contenedores Docker y se pueden inspeccionar con `docker exec`.

| Base de datos | Herramienta | Cómo usarla |
| --- | --- | --- |
| PostgreSQL | Prisma Studio | `make db-studio` o `.\dev.ps1 db-studio` |
| MongoDB | `mongosh` (dentro del contenedor) | `docker exec -it matcom_bench_press_mongo mongosh -u USUARIO -p CONTRASEÑA --authenticationDatabase admin`<br>Sustituye `USUARIO` y `CONTRASEÑA` por los valores de `POSTGRES_USER` y `POSTGRES_PASSWORD` de tu `.env`. Para salir, usa `Ctrl + C`, `.exit` o `quit()`. |

Una vez dentro de `mongosh`:

```js
show dbs
use gimnasioDB   # o el nombre de base de datos que hayas configurado
show collections
db.rutina_estructura.find()
```


## Documentación detallada

- `docs/Documentación/Documentación Backend.md`: arquitectura del backend, capas, patrones de diseño y comandos útiles.
- `docs/Documentación/Documentación Frontend.md`: instalación, stack, arquitectura, estructura de carpetas, patrones de diseño y cómo activar/desactivar los mocks.
- `docs/Documentación/Documentación Base de Datos.md`: esquema de PostgreSQL, entidades, relaciones, migraciones y datos de ejemplo.
- `Docs/`: informes de diseño de la base de datos e ingeniería de software (documentos académicos).