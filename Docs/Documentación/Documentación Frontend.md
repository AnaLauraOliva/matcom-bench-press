# Documentación Frontend

Interfaz de usuario del proyecto **matcom-bench-press**, construida con React 19, TypeScript, Vite 8 y Tailwind CSS 4. Permite a clientes, entrenadores, jefes de sala y administradores interactuar con el sistema de gestión de planes de entrenamiento del gimnasio.

## Stack tecnológico

| Capa | Tecnología | Para qué se usa |
| --- | --- | --- |
| Lenguaje | TypeScript | Tipado estático y detección temprana de errores. |
| Framework de UI | React 19 | Construcción de componentes y manejo del estado de la interfaz. |
| Herramienta de build | Vite 8 | Servidor de desarrollo rápido y empaquetado para producción. |
| Estilos | Tailwind CSS 4 | Estilos utilitarios con la paleta del proyecto (`#004C4C`, `#00A699`, `#B2D8D8`, `#F5F5F5`, `#FFFFFF`). |
| Cliente HTTP | Axios | Peticiones a la API del backend. |
| Ruteo | React Router 8 | Navegación entre vistas y protección de rutas por rol. |
| Almacenamiento local | localStorage | Persistencia de la sesión de autenticación entre recargas. |
| Variables de entorno | Vite (`VITE_*`) | URL de la API y activación/desactivación de mocks. |

## Arquitectura

El frontend sigue una arquitectura por capas inspirada en Clean Architecture, adaptada al ecosistema React:

1. **Domain** (`src/domain/entities`): tipos y entidades puras del negocio (ejercicio, ubicación, rutina generada, dashboard del entrenador), independientes de cualquier tecnología externa.
2. **Application** (`src/application`): puertos (interfaces), casos de uso y DTOs. Orquesta las operaciones y aplica las reglas de la aplicación sin depender de cómo se obtienen o guardan los datos.
3. **Infrastructure** (`src/infrastructure`): implementaciones concretas de los puertos (repositorios HTTP y mocks, cliente de axios, mappers, factories).
4. **Presentation** (`src/presentation`): componentes, páginas, hooks, contextos, rutas y estilos. Capa visible al usuario.

Las dependencias fluyen de Presentation hacia Domain: la presentación depende de la aplicación, la aplicación de los puertos, y la infraestructura implementa esos puertos.

## Estructura de carpetas y propósito

```
frontend/src/
├── application/
│   ├── dtos/              Objetos de transferencia de datos (DTOs) entre capas (ej. auth.ts).
│   ├── ports/             Interfaces (contratos) que definen qué debe hacer cada repositorio o servicio, sin decir cómo.
│   └── use-cases/         Casos de uso de la aplicación (login, registro, obtención de ejercicios, generación de rutinas, etc.).
├── domain/
│   └── entities/          Tipos y entidades del negocio (Exercise, Location, GeneratedRoutine, TrainerDashboard, etc.).
├── infrastructure/
│   ├── http/              Cliente HTTP configurado (axios con interceptor de token).
│   └── repositories/      Implementaciones concretas de los puertos:
│       │   Http*.ts         Adaptadores que llaman a la API del backend.
│       │   Mock*.ts         Implementaciones en memoria para trabajar sin backend.
│       │   *Factory.ts      Factorías que eligen entre HTTP y Mock según VITE_USE_MOCK.
│       └── httpMappers.ts   Transformación de datos de la API a entidades del dominio.
├── presentation/
│   ├── assets/            Recursos estáticos.
│   ├── components/        Componentes reutilizables.
│   ├── contexts/          Contextos de React.
│   ├── hooks/             Hooks personalizados.
│   ├── pages/             Vistas completas.
│   ├── routes/            Definición de rutas públicas y protegidas por rol.
│   ├── styles/            Hojas de estilo CSS globales y por sección.
│   └── types/             Tipos compartidos de presentación.
├── App.tsx                Componente raíz: enrutador y proveedor de sesión.
├── index.css              Estilos globales.
└── main.tsx               Punto de entrada de la aplicación.
```

## Patrones de diseño utilizados

El frontend aplica patrones de diseño orientados a objetos clasificados según el catálogo de la Gang of Four (GOF). Cada uno va acompañado del archivo o archivos donde se implementa.

### Patrones de creación

| Patrón | Archivo(s) | Aplicación |
|--------|------------|------------|
| **Factory Method / Simple Factory** | `infrastructure/repositories/exerciseRepositoryFactory.ts`<br>`infrastructure/repositories/generateRoutineFactory.ts` | Devuelven una implementación u otra (`Http*` o `Mock*`) según `VITE_USE_MOCK`, ocultando al cliente qué clase concreta se instantiar. Ambas devuelven objetos que implementan la misma interfaz (puerto). |
| **Dependency Injection por constructor** | `application/use-cases/auth/Login.ts`<br>`application/use-cases/auth/RegisterClient.ts`<br>`application/use-cases/location/GetLocations.ts`<br>`application/use-cases/exercises/GetExercises.ts`<br>`application/use-cases/routines/GenerateRoutine.ts`<br>`App.tsx` | Cada caso de uso recibe su repositorio o puerto por el constructor en lugar de crearlo internamente. `App.tsx` ensambla las dependencias concretas y las inyecta. |
| **Singleton (implícito)** | `infrastructure/http/apiClient.ts` | Se crea una única instancia de axios con `axios.create()` y se exporta por defecto para reutilizarla en toda la aplicación. |

### Patrones estructurales

| Patrón | Archivo(s) | Aplicación |
|--------|------------|------------|
| **Adapter** | `infrastructure/repositories/httpMappers.ts`<br>`infrastructure/repositories/HttpExerciseRepository.ts`<br>`infrastructure/repositories/HttpAuthRepository.ts`<br>`infrastructure/repositories/MockExerciseRepository.ts`<br>`infrastructure/repositories/MockGenerateRoutine.ts` | `httpMappers.ts` traduce la forma del API (`ApiExercise`, `ApiMuscleGroup`) a la entidad del dominio (`Exercise`, `MuscleGroup`). Los repositorios HTTP y Mock adaptan el puerto definido en `application/ports/` a una tecnología concreta (HTTP o memoria). |
| **Repository** | `application/ports/*.ts` + `infrastructure/repositories/*.ts` | Las interfaces en `ports/` definen contratos de acceso a datos (`getAll`, `login`, `generate`, etc.). Las implementaciones en `repositories/` cumplen esos contratos sin que la aplicación conozca el origen real de los datos. |
| **Data Mapper** | `infrastructure/repositories/httpMappers.ts` | Transformaciones explícitas entre registros del API y entidades del dominio (`mapExercise`, `mapMuscleGroup`, `typeToApi`, `intensityToApi`, etc.). |
| **Facade** | `infrastructure/http/apiClient.ts` | Centraliza la configuración de axios (`baseURL`, headers, interceptor de token) para que el resto de la aplicación no use axios directamente de forma dispersa. |
| **Proxy (remoto)** | `infrastructure/repositories/Http*.ts` | Los repositorios HTTP actúan como proxies: la aplicación llama a un método local y el repositorio ejecuta una petición HTTP en segundo plano. |

### Patrones de comportamiento

| Patrón | Archivo(s) | Aplicación |
|--------|------------|------------|
| **Strategy** | `infrastructure/repositories/*Factory.ts`<br>`application/use-cases/*.ts`<br>`application/ports/*.ts` | Las factories seleccionan entre `Http*` y `Mock*` como estrategias intercambiables de acceso a datos. Los casos de uso delegan en un puerto inyectado: el algoritmo de obtención o guardado de datos se puede cambiar sin modificar el caso de uso. |
| **Command** (implícito) | `application/use-cases/auth/Login.ts`<br>`application/use-cases/auth/RegisterClient.ts`<br>`application/use-cases/location/GetLocations.ts`<br>`application/use-cases/routines/GenerateRoutine.ts` | Cada caso de uso encapsula una acción en un objeto con un método `execute()`. El cliente (React/hooks) invoca `execute()` sin saber cómo se realiza internamente. |
| **Observer / Pub-Sub (React Context)** | `presentation/contexts/AuthSessionContext.tsx`<br>`presentation/hooks/useAuth.ts` | El contexto expone el estado de sesión y los componentes consumidores se suscriben a sus cambios (re-renderizan cuando la sesión cambia). Es una adaptación del patrón Observer al ecosistema React. |
| **Interceptor / Middleware** | `infrastructure/http/apiClient.ts` | Un interceptor de axios intercepta cada petición saliente para inyectar el token de autorización desde `localStorage`. Es una cadena de responsabilidad ligera aplicada a las peticiones HTTP. |


## Instalación

Desde la carpeta `frontend`:

```bash
npm install
```

Esto instala todas las dependencias listadas en `package.json`.

## Variables de entorno

Crea un archivo `.env` (o `.env.local`) en la carpeta `frontend` a partir de `frontend/.env.example`:

| Variable | Valor por defecto | Descripción |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | URL base de la API del backend. |
| `VITE_USE_MOCK` | `true` | `true` para usar repositorios en memoria; `false` para usar los endpoints HTTP del backend. |

En Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

Edita el archivo y ajusta los valores según tu entorno.

## Cómo levantar el frontend

Desde la carpeta `frontend`:

```bash
npm run dev
```

Vite mostrará la dirección local (por defecto `http://localhost:5173`).

Si usas los comandos globales del proyecto (`make start` en Linux o `.\dev.ps1 start` en Windows), el frontend se levanta automáticamente en una terminal separada junto con el backend y la base de datos.

## Cómo activar y desactivar los mocks

El frontend puede funcionar sin backend usando repositorios en memoria (mocks). El comportamiento se controla con `VITE_USE_MOCK` en el archivo `.env` de la carpeta `frontend`.

### Activar mocks (recomendado para probar sin backend)

```env
VITE_USE_MOCK=true
```

Con este valor, las factorías devuelven las implementaciones en memoria:

- `MockExerciseRepository`: banco de ejercicios y grupos musculares en memoria.
- `MockGenerateRoutine`: generación de rutinas en memoria con bloques (calentamiento, circuito, series, descanso).
- `MockTrainerDashboard`: panel del entrenador con datos de ejemplo.

### Desactivar mocks (usar backend real)

```env
VITE_USE_MOCK=false
```

Con este valor, las factorías devuelven las implementaciones HTTP que llaman a los endpoints del backend (`/auth/login`, `/auth/register`, `/exercises`, etc.). Requiere que el backend esté levantado y accesible en `VITE_API_URL`.

> **Nota:** tras cambiar `VITE_USE_MOCK`, reinicia el servidor de desarrollo (`npm run dev`) para que Vite tome el nuevo valor de la variable de entorno.

## Rutas principales

| Ruta | Rol | Descripción |
| --- | --- | --- |
| `/` | Público | Landing page y formulario de autenticación (login / registro). |
| `/admin` | ADMIN | Panel de administración. |
| `/trainer` | TRAINER, HEAD_TRAINER | Panel del entrenador (generación de rutinas, ejercicios, reportes). |
| `/client` | CLIENT | Panel del cliente (rutinas asignadas, sesiones). |

Las rutas protegidas redirigen al login si el usuario no tiene sesión válida o no tiene el rol requerido.

## Comandos útiles

Desde la carpeta `frontend`:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Compila la aplicación para producción (`tsc` + `vite build`). |
| `npm run lint` | Ejecuta ESLint para revisar el código. |
| `npm run preview` | Previsualiza la build de producción localmente. |

## Relación con el resto del proyecto

Este frontend consume la API del backend (ver `docs/Documentación/Documentación Backend.md`) y depende de la base de datos PostgreSQL (ver `docs/Documentación/Documentación Base de Datos.md`). Para levantar todo el proyecto de una sola vez, usa los comandos descritos en el `README.md` de la raíz (`make start` en Linux o `.\dev.ps1 start` en Windows).
