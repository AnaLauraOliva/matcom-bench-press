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
