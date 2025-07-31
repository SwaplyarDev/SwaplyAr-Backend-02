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

## 📝 Notas

* El proyecto usa `ValidationPipe` global para validar DTOs.
* El sistema de autenticación OTP usa **correo electrónico** (Gmail via Nodemailer).
* Swagger se activa automáticamente solo fuera de producción (`NODE_ENV !== 'production'`).
* No se debe usar `synchronize: true` en entornos productivos.
* La conexión a PostgreSQL se realiza a través de `DATABASE_URL` tanto en desarrollo como producción.

---
