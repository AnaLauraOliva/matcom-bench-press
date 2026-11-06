# matcom-bench-press

Proyecto de las asignaturas Bases de Datos II e Ingeniería de Software, curso 2026-2027

## Para levantar el backend

### Requisitos

Tener node 24.21.0 y npm instalados.

Clonar el repositorio

### Pasos

Primero crea los .env con los datos solicitados por el .env.example

``` bash
# Crear el .env de la carpeta raíz
cp .env.exaple .env
# Editar el .env

# Crear el contenedor con postgre
docker compose up -d

# Verificar que está corriendo
docker compose ps

# Ir a la carpeta backend
cd backend

# Instalar las dependencias
npm install

# Configurar el .env de backend si no se ha hecho ya
cp .env.example .env
# Edita el .env

# Activar prisma
npx prisma generate
npx prisma migrate dev --name init #Solo la primera vez
npx prisma db seed #Introducir los ejemplos de Sedes y al admin

# Arrancar backend
npm run dev
```

## Pasos para levantar el frontend

1. Acceder al directorio del frontend si no lo estás:

```bash
cd frontend
```

2. Instalar las dependencias:

```bash
npm install
```

3. Crear el archivo `.env` a partir del ejemplo:

En Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

En Linux/macOS:

```bash
cp .env.example .env
```

4. Configurar las variables de entorno en el archivo `.env`, según el entorno de ejecución.

5. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local donde se encuentra disponible la aplicación. Es la por defecto:

```text
http://localhost:5173
```

Luego de la primera vez, desde la carpeta frontend, iniciar directamente:

```bash
npm run dev
```