---

# 📦 SwaplyAR Backend

Proyecto backend desarrollado con [NestJS](https://nestjs.com/) para la plataforma **SwaplyAR**. Utiliza PostgreSQL como base de datos, TypeORM para la comunicación con la base de datos y Nodemailer para el envío de correos.

---

## 🚀 Cómo iniciar el proyecto

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

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
NODE_ENV=development
DB_HOST=
DB_NAME=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=

EMAIL_USER=
EMAIL_PASS=

# JWT Configuration
JWT_SECRET=
JWT_REFRESH_SECRET= 
```

> ⚠️ No incluyas valores sensibles en el repositorio.

---

## 🧱 Cómo generar la base de datos

Este proyecto utiliza **TypeORM**. Al ejecutar el proyecto en modo desarrollo (`NODE_ENV=development`), se ejecutará automáticamente la sincronización del esquema y se eliminará el esquema anterior (`dropSchema: true`).

> ⚠️ ¡Ten cuidado con esta configuración en producción!

La base de datos se genera automáticamente al correr:

```bash
npm run start:dev
```

---

## 🛠️ Comandos útiles

| Comando               | Descripción                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `npm run start`       | Inicia la aplicación en modo producción                                |
| `npm run start:dev`   | Inicia la aplicación en modo desarrollo con *watch mode*               |
| `npm run start:debug` | Inicia el modo debug con *watch mode*                                  |
| `npm run build`       | Compila el proyecto en la carpeta `dist/`                              |
| `npm run format`      | Aplica Prettier a los archivos `.ts`                                   |
| `npm run lint`        | Ejecuta ESLint y aplica correcciones automáticas                       |
| `npm run test`        | Ejecuta los tests unitarios con Jest                                   |
| `npm run test:watch`  | Ejecuta los tests en modo *watch*                                      |
| `npm run test:cov`    | Genera reporte de cobertura de código                                  |
| `npm run test:debug`  | Ejecuta los tests en modo debug                                        |
| `npm run test:e2e`    | Ejecuta los tests de integración (E2E) definidos en la carpeta `test/` |

---

## 📁 Estructura de carpetas

```
src/
├── app/                    # Módulo principal y configuración de NestJS
├── config/                 # Archivos de configuración (.env, TypeORM, Nodemailer)
├── enum/                  # Enumeraciones usadas globalmente
├── modules/               # Contiene los distintos módulos de negocio
│   ├── auth/              # Módulo de autenticación (OTP, login, etc.)
│   ├── users/             # Gestión de usuarios
│   ├── transactions/      # Gestión de transacciones
│   ├── financial-accounts/ # Cuentas financieras
│   ├── file-upload/       # Subida de archivos
├── service/               # Servicios generales (ej: mailer)
```

---

## 🔒 Variables de entorno requeridas (sin valores)

```env
# Entorno de ejecución
NODE_ENV=

# Base de datos PostgreSQL
DB_HOST=
DB_NAME=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=

# Email (Nodemailer / Gmail)
EMAIL_USER=
EMAIL_PASS=

# JWT Configuration
JWT_SECRET= 
JWT_REFRESH_SECRET= 
```

---

## 📝 Notas adicionales

* Este proyecto utiliza `ValidationPipe` de NestJS para validar automáticamente los DTOs.
* El OTP es enviado por correo electrónico usando **Nodemailer** con el servicio de Gmail.
* **Importante:** En producción debes establecer `NODE_ENV=production` y desactivar `synchronize` y `dropSchema`.

---
