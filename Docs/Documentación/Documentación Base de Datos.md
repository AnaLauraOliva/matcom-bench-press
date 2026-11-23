# Documentación Base de Datos

Base de datos relacional del proyecto **matcom-bench-press**, implementada con **PostgreSQL 17** y gestionada mediante **Prisma 7** como ORM. Almacena la información del gimnasio: usuarios, roles, sedes, ejercicios, rutinas, programas de entrenamiento, asignaciones y sesiones.

## Origen del esquema

La fuente de verdad es `backend/prisma/schema.prisma`. A partir de ese archivo:

- `prisma generate` crea el cliente de Prisma (`backend/src/infrastructure/database/generated`).
- `prisma migrate dev` aplica las migraciones en `backend/prisma/migrations/`.
- `prisma db seed` carga datos de ejemplo desde `backend/prisma/seed.ts`.

## Modelo de datos principal

El esquema organiza la información en las siguientes entidades y relaciones:

### Usuarios y roles

| Entidad | Descripción |
| --- | --- |
| `Usuario` | Usuario base del sistema (nombre, email, contraseña, teléfono, fecha de registro, activo). |
| `Administrador` | Especialización de usuario con rol de administración. |
| `Entrenador` | Entrenador con especialidad; puede crear ejercicios y rutinas. |
| `Jefe_de_sala` | Entrenador que además valida rutinas. |
| `Cliente` | Cliente perteneciente a una sede; puede inscribirse en programas y recibir rutinas asignadas. |

Un usuario puede ser a la vez cliente, entrenador, administrador y/o jefe de sala mediante las relaciones uno-a-uno con `Client`, `Admin`, `Trainer` y `HeadTrainer`.

### Sedes

| Entidad | Descripción |
| --- | --- |
| `Sede` | Sede del gimnasio (nombre, dirección). Un cliente pertenece a una sola sede. |

### Ejercicios

| Entidad | Descripción |
| --- | --- |
| `Ejercicio` | Ejercicio del banco (nombre, descripción, creador). |
| `Tipo_Ejercicio` | Tipo: Fuerza, Cardio o Flexibilidad. |
| `Clasificacion_por_Tipo` | Relación muchos-a-muchos entre ejercicio y tipo. |
| `Grupo_Muscular` | Grupo muscular (ej. Pectorales, Cuádriceps). |
| `Clasificacion_por_Grupo_Muscular` | Relación muchos-a-muchos entre ejercicio y grupo muscular. |

### Programas y rutinas

| Entidad | Descripción |
| --- | --- |
| `Programa_de_Entrenamiento` | Programa con nombre, objetivo y descripción. |
| `Programa_Cubre_Grupo` | Qué grupos musculares cubre cada programa. |
| `Rutina` | Rutina creada por un entrenador (proporciones fuerza/cardio/flexibilidad, cantidad de ejercicios). |
| `Rutina_Pertenece_Programa` | Qué rutinas pertenecen a qué programas. |
| `Inlcluye_Ejercicio` | Qué ejercicios incluye cada rutina. |
| `Validar_Rutina` | Validación de una rutina por un jefe de sala (aprobada, observaciones, fecha). |

### Asignaciones y seguimiento

| Entidad | Descripción |
| --- | --- |
| `Puede_Generar_Rutina` | Permiso de un entrenador para generar rutinas de un programa. |
| `Puede_Validar_Rutina` | Permiso de un entrenador para validar rutinas de un programa. |
| `Inscripcion_Programa` | Inscripción de un cliente a un programa (fecha, estado). |
| `Rutina_Asignada` | Rutina asignada a un cliente (estado). |
| `Sesion` | Sesión de entrenamiento ejecutada (fecha, duración, observaciones). |
| `Solicitud_Ajuste` | Solicitud de un cliente a un entrenador para ajustar una rutina (resultado, estado). |

### Esquema relacional simplificado

```
Usuario 1──1 Cliente  N──1 Sede
Usuario 1──1 Administrador
Usuario 1──1 Entrenador
Entrenador 1──1 Jefe_de_sala

Sede 1──N Cliente
Cliente N──M Programa_de_Entrenamiento (Inscripcion_Programa)
Cliente N──M Rutina (Rutina_Asignada)
Rutina_Asignada 1──N Sesion

Entrenador N──M Programa_de_Entrenamiento (Puede_Generar_Rutina, Puede_Validar_Rutina)
Programa_de_Entrenamiento N──M Rutina (Rutina_Pertenece_Programa)
Rutina N──M Ejercicio (Inlcluye_Ejercicio)
Ejercicio N──M Tipo_Ejercicio (Clasificacion_por_Tipo)
Ejercicio N──M Grupo_Muscular (Clasificacion_por_Grupo_Muscular)
Programa_de_Entrenamiento N──M Grupo_Muscular (Programa_Cubre_Grupo)

Jefe_de_sala 1──N Validar_Rutina
Rutina 1──1 Validar_Rutina
Cliente N──M Entrenador (Solicitud_Ajuste)
Rutina N──M Entrenador (Solicitud_Ajuste)
Cliente N──M Rutina (Solicitud_Ajuste)
```

## Migraciones y datos de ejemplo

### Primera vez

```bash
cd backend
npm run prisma:migrate   # Crea todas las tablas
npm run prisma:seed      # Carga datos de ejemplo (sedes, usuarios, ejercicios, rutinas, etc.)
```

### Reconstruir desde cero

Desde la raíz del proyecto:

- Linux: `make reset`
- Windows: `.\dev.ps1 reset`

> **Advertencia:** `reset` elimina el volumen de Docker (`docker compose down -v`), borrando toda la estructura y los datos de la base de datos, y luego los recrea desde cero.

## Herramientas

| Comando | Qué hace |
| --- | --- |
| `prisma studio` | Abre una interfaz gráfica para explorar y editar los datos de PostgreSQL. |
| `prisma migrate dev` | Aplica migraciones nuevas al esquema. |
| `prisma db seed` | Vuelve a cargar los datos de ejemplo (solo inserta si la tabla está vacía). |

## Base de datos documental: MongoDB

Además de PostgreSQL, el proyecto utiliza **MongoDB 8.0** para almacenar las estructuras variables de las rutinas. La estructura de una rutina puede cambiar según el entrenador y el objetivo del cliente (bloques simples, circuitos anidados, distintas repeticiones y descansos), por lo que no encaja en un esquema relacional rígido.

### Colección `rutina_estructura`

Cada documento representa la estructura de bloques de una rutina:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `_id` | `number` | Identificador numérico de la rutina (clave primaria). |
| `version` | `number` | Versión de la estructura. |
| `bloques` | `array` | Lista de bloques de la rutina. |

Cada bloque contiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `tipo` | `string` | `'calentamiento'`, `'circuito'`, `'serie'` o `'descanso'`. |
| `orden` | `number` | Orden de aparición dentro de la rutina. |
| `duracion` | `number` \| `null` | Duración en minutos (para calentamiento y descanso). |
| `repeticiones` | `number` \| `null` | Número de repeticiones del bloque. |
| `descanso` | `number` \| `null` | Tiempo de descanso en minutos. |
| `ejercicios` | `array` | Lista de ejercicios incluidos en el bloque. |
| `bloques` | `array` \| `undefined` | Bloques anidados (ej. varios circuitos dentro de un circuito). |

Cada ejercicio dentro de un bloque:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id_ejercicio` | `number` | Identificador del ejercicio en PostgreSQL. |
| `orden` | `number` | Orden dentro del bloque. |
| `series` | `number` \| `null` | Número de series. |
| `repeticiones` | `number` \| `null` | Repeticiones por serie. |
| `tiempo` | `number` \| `null` | Tiempo en segundos. |
| `nivel_intensidad` | `string` | `'bajo'`, `'medio'` o `'alto'`. |

### Conexión y seed

La conexión se establece con Mongoose usando la variable `MONGODB_URI` (definida en `backend/.env.example`). El archivo `backend/src/infrastructure/database/mongo/connect-mongo.ts` crea la conexión y `backend/src/infrastructure/database/mongo/routine-structure-schema.ts` define el esquema de Mongoose en la colección `rutina_estructura`.

Para cargar los datos de ejemplo:

```bash
cd backend
npm run mongo:seed
```

Este script lee `backend/scripts/seed-data/routine-structures.ts` e inserta (sin sobrescribir si ya existen) tres estructuras de rutina: fuerza cuerpo completo, resistencia básica y movilidad general.

### Volumen de Docker

El servicio `mongo` en `docker-compose.yml` monta el volumen `mongo-data` en `/data/db`. Al igual que con PostgreSQL:

- `docker compose down` conserva los datos de MongoDB.
- `docker compose down -v` los elimina.

## Relación con el resto del proyecto

- El **backend** (`docs/Documentación/Documentación Backend.md`) usa Prisma para PostgreSQL y Mongoose para MongoDB.
- El **frontend** (`docs/Documentación/Documentación Frontend.md`) consume la API del backend, no accede directamente a ninguna base de datos.
- Para levantar todo el proyecto de una sola vez, usa los comandos descritos en el `README.md` de la raíz (`make start` en Linux o `.\dev.ps1 start` en Windows).
