# 📦 SwaplyAR Backend

Proyecto backend desarrollado con [NestJS](https://nestjs.com/) para la plataforma **SwaplyAR**. Utiliza PostgreSQL como base de datos mediante TypeORM, y Nodemailer para el envío de correos.

---

## ✨ Cómo iniciar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/swaplyar-backend.git
cd swaplyar-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.development` en la raíz del proyecto con las siguientes variables:

```env
NODE_ENV=development
PORT=3001

# Conexión a la base de datos
DATABASE_URL=postgres://postgres:admin@localhost:5432/swaplyar

# Configuración de correo
EMAIL_USER=brasil@swaplyar.com
EMAIL_PASS=skhcshxzorvcakzh

# Cloudinary (para gestión de imágenes)
CLOUDINARY_CLOUD_NAME=dy1jiclwg
CLOUDINARY_CLOUD_API_KEY=115827898811265
CLOUDINARY_CLOUD_API_SECRET=knWKfq_BDaqPplvw1jrWrXC0OF4

# JWT
JWT_SECRET=b65e41a970ce309c9fea789738c16c7ee1bcaf90e1d0e876f0a49b71d45bdb0a
JWT_REFRESH_SECRET=d91f66dc620f9f78b5abdd75d165c1073bcb0bf0a88502d381a6dace7f3be9d8
```

> 📌 En producción, se utiliza la misma variable `DATABASE_URL`, apuntando a un host remoto como Neon o Render.

---

## 🧱 Base de datos en desarrollo

Este proyecto usa **TypeORM**. En entorno de desarrollo (`NODE_ENV=development`), al ejecutar la app se sincroniza el esquema de forma automática.

```bash
npm run start:dev
```

Esto conectará a la base de datos definida en `DATABASE_URL` y creará las tablas necesarias si no existen.

> ⚠️ `synchronize: true` solo está habilitado en desarrollo. En producción se desactiva por seguridad.

---

## 🛠️ Comandos útiles

| Comando               | Descripción                                                 |
| --------------------- | ----------------------------------------------------------- |
| `npm run start`       | Inicia la aplicación en modo producción                     |
| `npm run start:dev`   | Inicia en desarrollo con *watch mode*                       |
| `npm run start:debug` | Inicia en modo debug con *watch*                            |
| `npm run build`       | Compila el proyecto en la carpeta `dist/`                   |
| `npm run format`      | Aplica Prettier a los archivos `.ts`                        |
| `npm run lint`        | Ejecuta ESLint y aplica correcciones                        |
| `npm run test`        | Ejecuta los tests unitarios con Jest                        |
| `npm run test:watch`  | Ejecuta tests en modo *watch*                               |
| `npm run test:cov`    | Genera reporte de cobertura de código                       |
| `npm run test:debug`  | Ejecuta tests en modo debug                                 |
| `npm run test:e2e`    | Ejecuta los tests de integración (E2E) definidos en `test/` |

---

## 📁 Estructura del proyecto

```
src/
├── app/                    # Módulo principal de la aplicación
├── config/                 # Configuración de entorno, TypeORM y nodemailer
├── modules/               # Módulos funcionales (negocio)
│   ├── auth/              # Autenticación y OTP
│   ├── users/             # Usuarios
│   ├── transactions/      # Transacciones
│   ├── financial-accounts/ # Cuentas financieras
│   ├── file-upload/       # Subida de archivos
└── service/               # Servicios generales (ej. mailer)
└── common/                # Utilidades, interceptores, pipes y estrategias
```

---

## 🔐 Variables de entorno esperadas

```env
# Entorno y servidor
NODE_ENV=
PORT=

# Base de datos
DATABASE_URL=

# Gmail (Nodemailer)
EMAIL_USER=
EMAIL_PASS=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_CLOUD_API_KEY=
CLOUDINARY_CLOUD_API_SECRET=

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=
```

---

Perfecto, te agrego la sección de documentación sobre **migraciones con TypeORM** para que quede coherente con el estilo actual del `README.md`. Esto incluye:

* Cómo generar una migración
* Cómo correr las migraciones
* Recomendaciones

---

### 📦 README actualizado (agregando sección de migraciones)

````md
---

## 🧬 Migraciones con TypeORM

En producción, el esquema de la base de datos **no se sincroniza automáticamente**. En su lugar, se generan y ejecutan migraciones usando TypeORM.

### 🔨 Generar una nueva migración

Usá el siguiente comando para generar una migración a partir de los cambios en las entidades:

```bash
npm run migration:generate -- src/database/migrations/NombreDeLaMigracion
````

> Reemplazá `NombreDeLaMigracion` por un nombre descriptivo, como `InitSchema` o `AddUserStatusField`.

Esto generará un archivo en `src/database/migrations/` con las instrucciones necesarias para actualizar la base de datos.

### 🚀 Ejecutar migraciones

Para aplicar las migraciones pendientes en la base de datos, ejecutá:

```bash
npm run migration:run
```

Este comando aplicará todas las migraciones aún no ejecutadas en la base de datos apuntada por `DATABASE_URL`.

### ⏪ Revertir la última migración (opcional)

Si necesitás deshacer la última migración ejecutada:

```bash
npm run migration:revert
```



## 📝 Notas

* El proyecto usa `ValidationPipe` global para validar DTOs.
* El sistema de autenticación OTP usa **correo electrónico** (Gmail via Nodemailer).
* Swagger se activa automáticamente solo fuera de producción (`NODE_ENV !== 'production'`).
* No se debe usar `synchronize: true` en entornos productivos.
* La conexión a PostgreSQL se realiza a través de `DATABASE_URL` tanto en desarrollo como producción.

---

## 🚀 Despliegue en Render

### 1. Configuración en Render

1. Ve a [Render Dashboard](https://dashboard.render.com) y crea un nuevo servicio web.
2. Conecta tu repositorio de GitHub.
3. Selecciona **Docker** como runtime (usará el `Dockerfile` incluido).
4. Configura las variables de entorno en el dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: (Render lo asigna automáticamente)
   - `DATABASE_URL`: Tu URL de base de datos (ej. Neon PostgreSQL)
   - `JWT_SECRET`: Tu secreto JWT
   - `JWT_REFRESH_SECRET`: Tu secreto de refresh JWT
   - `EMAIL_USER`: Usuario de email
   - `EMAIL_PASS`: Contraseña de email
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_CLOUD_API_KEY`, `CLOUDINARY_CLOUD_API_SECRET`: Credenciales de Cloudinary
   - `BASE_URL`: `https://swaplyar.com`
   - `CORS_ORIGINS`: `https://www.swaplyar.com,https://swaplyar-swaplyar.vercel.app`

5. En **Build Command**: `npm run build`
6. En **Start Command**: `npm run start:prod`
7. Configura el **Health Check Path** como `/health`.

### 2. Migraciones de base de datos

Después del despliegue, ejecuta las migraciones manualmente en el shell de Render:

```bash
npm run migrate:prod
```

O configura un comando post-build si es necesario.

### 3. Optimizaciones aplicadas

- **Dockerfile optimizado**: Usa multi-stage build para reducir el tamaño de la imagen.
- **Usuario no-root**: Para mayor seguridad.
- **Health check**: Endpoint `/health` para monitoreo.
- **Manejo de errores**: Mejor logging en producción.
- **Variables de entorno**: Todas las sensibles configuradas externamente.

---
