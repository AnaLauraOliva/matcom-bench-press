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