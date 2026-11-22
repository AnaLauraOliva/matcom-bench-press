# matcom-bench-press

Proyecto de las asignaturas Bases de Datos II e Ingeniería de Software, curso 2026-2027.

## Descripción del proyecto

Aplicación web para gestionar la generación automática de planes de entrenamiento en un gimnasio. El sistema cubre la gestión de ejercicios (fuerza, cardio y flexibilidad), grupos musculares, intensidades, programas, entrenadores, clientes y sus inscripciones; la generación, revisión y aprobación de rutinas con observaciones; la asignación de rutinas y el registro de sesiones; el seguimiento del progreso y las solicitudes de ajuste; y la producción de reportes sobre rutinas, ejercicios, intensidades, rendimiento, finalización y abandono, con ordenación y exportación a PDF.

## Stack tecnológico

| Capa | Tecnología | Para qué se usa |
| --- | --- | --- |
| Frontend | React 19 y TypeScript | Interfaz de usuario y tipado de los datos. |
| Frontend | Vite 8 | Servidor de desarrollo y empaquetado de la aplicación. |
| Frontend | Tailwind CSS 4 | Estilos responsive con la paleta del proyecto: `#004C4C`, `#00A699`, `#B2D8D8`, `#F5F5F5`, `#FFFFFF`. |
| Backend | Node.js 24.21.0, Express 5 y TypeScript | API REST, validación de entradas y reglas de negocio. |
| ORM | Prisma 7 | Operaciones CRUD, migraciones y datos de ejemplo sobre PostgreSQL. |
| Base de datos relacional | PostgreSQL 17 | Persistencia de la información del negocio. |
| Base de datos documental | MongoDB | Prevista para las estructuras variables de las rutinas; hoy **no** forma parte del entorno local (ver nota más abajo). |
| Entorno local | Docker Compose | Levanta y detiene el contenedor de PostgreSQL. |
| Diseño | Clean Architecture y patrones Adapter, Template Method y Data Mapper | Separación de responsabilidades; detalles en `backend/README.md`. |
| Planificación | Trello | Seguimiento de las tareas del equipo. |

> **Nota sobre MongoDB:** está previsto en el diseño para las estructuras variables de las rutinas, pero `docker-compose.yml` solo define PostgreSQL y el esquema de Prisma apunta a PostgreSQL. Los comandos de este documento levantan únicamente PostgreSQL.

## Requisitos previos

- Node.js 24.21.0 y npm. Si usas nvm, ejecuta `nvm use` en la raíz (lee `.nvmrc`).
- Docker con Docker Compose v2. Los comandos usan `docker compose up -d --wait`, que espera a que PostgreSQL esté listo.
- Git y acceso al repositorio.

## Variables de entorno

Antes de usar los comandos, crea los archivos `.env` a partir de los ejemplos y rellénalos:

| Archivo | Crearlo con | Configura |
| --- | --- | --- |
| `.env` (raíz) | `cp .env.example .env` | Usuario, contraseña, base de datos y puerto de PostgreSQL para Docker Compose. |
| `backend/.env` | `cp backend/.env.example backend/.env` | `DATABASE_URL`, puerto del API, origen del CORS, JWT y bcrypt. |
| `frontend/.env` | `cp frontend/.env.example frontend/.env` | URL de la API y si se usan repositorios mock. |

En Windows, sustituye `cp` por `Copy-Item`, por ejemplo: `Copy-Item .env.example .env`.

El valor de `JWT_SECRET` debe tener al menos 32 caracteres. En el frontend también se admite `.env.local` en lugar de `.env`.

## Comandos

Ejecuta siempre desde la raíz del repositorio. `start` deja backend y frontend corriendo en segundo plano: los logs quedan en `logs/backend.log` y `logs/frontend.log`, y los PID en `pids/`. Ambas carpetas están ignoradas por Git. `stop` detiene esos procesos y baja el contenedor, pero **conserva la estructura y los datos** de PostgreSQL. No es lo mismo que `reset`; la diferencia se explica en [¿Qué pasa con la base de datos?](#qué-pasa-con-la-base-de-datos).

### Linux (`Makefile`)

| Comando | Qué hace | Sustituye a |
| --- | --- | --- |
| `make help` | Muestra la lista de comandos. | Leer esta sección. |
| `make install` | Instala las dependencias de backend y frontend. | `cd backend && npm install` y `cd frontend && npm install`. El `postinstall` de backend ya genera el cliente de Prisma. |
| `make start` | Levanta PostgreSQL, backend y frontend. | `docker compose up -d`, `cd backend && npm run dev` y `cd frontend && npm run dev` en tres terminales. |
| `make stop` | Apaga backend, frontend y PostgreSQL. | Cerrar las dos terminales de desarrollo y ejecutar `docker compose down`. |
| `make db-migrate` | Aplica las migraciones pendientes de Prisma. | `cd backend && npm run prisma:migrate` (`prisma migrate dev`). Con el historial actual aplica las migraciones existentes sin preguntar; solo pedirá nombre si hay cambios nuevos en `schema.prisma`. |
| `make db-seed` | Carga en todas las tablas los datos de ejemplo definidos en `backend/prisma/seed.ts`. | `cd backend && npm run prisma:seed`. |
| `make db-studio` | Abre Prisma Studio para explorar la base de datos. | `cd backend && npm run prisma:studio`. |
| `make check` | Verifica tipos, lint y compilación de ambos proyectos. | `npm run typecheck` y `npm run build` en backend, y `npm run lint` y `npm run build` en frontend. |
| `make reset` | **Destructivo.** Borra la BD completa (estructura y datos), la reconstruye desde las migraciones y vuelve a cargar el seed. Ver [¿Qué pasa con la base de datos?](#qué-pasa-con-la-base-de-datos). | `make stop`, `docker compose down -v`, `make start`, `make db-migrate` y `make db-seed`. |

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
| `.\dev.ps1 stop` | `make stop` | Cerrar las terminales y `docker compose down`. |
| `.\dev.ps1 db-migrate` | `make db-migrate` | `cd backend; npm run prisma:migrate`. |
| `.\dev.ps1 db-seed` | `make db-seed` | `cd backend; npm run prisma:seed`. |
| `.\dev.ps1 db-studio` | `make db-studio` | `cd backend; npm run prisma:studio`. |
| `.\dev.ps1 check` | `make check` | Typecheck y build de backend, y lint y build de frontend. |
| `.\dev.ps1 reset` | `make reset` | Apagar, `docker compose down -v`, levantar, migrar y sembrar (borra la estructura y los datos; ver la sección siguiente). |

Si PowerShell bloquea el script, permite su ejecución con `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

### ¿Qué pasa con la base de datos?

El volumen `postgres_data` de Docker se monta en `/var/lib/postgresql/data`, es decir, contiene **todo** el cluster de PostgreSQL: tablas, índices, roles y también las filas. Por eso conviene distinguir estos dos comandos:

| Comando | Volumen | Estructura en la BD | Datos |
| --- | --- | --- | --- |
| `stop` (`docker compose down`) | Se conserva | Intacta | Intactos |
| `reset` (`docker compose down -v`) | Se elimina | Se borra y se recrea | Se borran y se recargan |

`reset` reconstruye la base de datos a partir de lo que está versionado en el repositorio:

1. Elimina el volumen y levanta un PostgreSQL vacío con el usuario y la base de datos configurados en `.env`.
2. `db-migrate` vuelve a crear todas las tablas aplicando los archivos de `backend/prisma/migrations/`. `backend/prisma/schema.prisma` es la fuente de verdad de ese diseño.
3. `db-seed` rellena **todas** las tablas con los datos de ejemplo de `backend/prisma/seed.ts`: sedes, usuarios (administradores, entrenadores y clientes), jefe de sala, tipos de ejercicio, grupos musculares, ejercicios, programas, rutinas, validaciones, asignaciones, sesiones y solicitudes de ajuste.

Al terminar, al abrir la BD verás tablas y datos de demostración. En cambio, **se pierde todo lo que no esté en las migraciones ni en el seed**: usuarios o rutinas creados al probar, sesiones registradas y cualquier cambio manual hecho con SQL. Usa `reset` solo cuando quieras partir de cero; en el día a día usa `stop`.

Si `db-seed` falla a mitad de proceso, puede quedar una BD con tablas vacías o parcialmente llenas, porque el seed inserta tabla por tabla. Revisa la salida del comando antes de darlo por bueno.

### Flujo habitual

La primera vez:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Editar los tres archivos .env con los valores del entorno

make install      # Windows: .\dev.ps1 install
make start        # Windows: .\dev.ps1 start
make db-migrate   # Windows: .\dev.ps1 db-migrate
make db-seed      # Windows: .\dev.ps1 db-seed (opcional)
```

En el día a día solo hacen falta `make start` al llegar y `make stop` al terminar (en Windows, `.\dev.ps1 start` y `.\dev.ps1 stop`).

Servicios tras `start`:

| Servicio | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| API backend | http://localhost:3000 |
| PostgreSQL | `localhost:5432` (o el puerto configurado en `.env`) |

## Arquitectura y documentación

- `backend/README.md`: descripción de las capas y de los patrones de diseño utilizados.
- `Docs/`: informes de diseño de la base de datos e ingeniería de software.
- `AGENTS.md`: convenciones y reglas de trabajo del repositorio.
