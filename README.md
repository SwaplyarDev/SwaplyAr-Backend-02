
# SwaplyAR Backend

Backend de la plataforma **SwaplyAR** desarrollado en [NestJS](https://nestjs.com/), usando PostgreSQL (TypeORM) y envío de correos con Nodemailer (Brevo SMTP).

---

## 🚀 Inicio rápido

1. Clona el repo y entra a la carpeta:
   ```bash
   git clone https://github.com/tu-usuario/swaplyar-backend.git
   cd swaplyar-backend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea `.env.development` en la raíz con:
   ```env
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgres://postgres:admin@localhost:5432/swaplyar
   EMAIL_HOST=smtp-relay.brevo.com
   EMAIL_PORT=587
   EMAIL_USER=brasil@swaplyar.com
   EMAIL_PASS=skhcshxzorvcakzh
   CLOUDINARY_CLOUD_NAME=dy1jiclwg
   CLOUDINARY_CLOUD_API_KEY=115827898811265
   CLOUDINARY_CLOUD_API_SECRET=knWKfq_BDaqPplvw1jrWrXC0OF4
   JWT_SECRET=b65e41a970ce309c9fea789738c16c7ee1bcaf90e1d0e876f0a49b71d45bdb0a
   JWT_REFRESH_SECRET=d91f66dc620f9f78b5abdd75d165c1073bcb0bf0a88502d381a6dace7f3be9d8
   ```

---

## 🛠️ Comandos principales

| Comando                  | Descripción                        |
|--------------------------|------------------------------------|
| `npm run start`          | Inicia en modo producción           |
| `npm run start:dev`      | Inicia en desarrollo (watch mode)   |
| `npm run build`          | Compila a `dist/`                   |
| `npm run test`           | Ejecuta tests unitarios             |
| `npm run test:e2e`       | Ejecuta tests de integración (E2E)  |
| `npm run migration:run`  | Aplica migraciones TypeORM          |
| `npm run migration:generate -- src/database/migrations/Nombre` | Genera migración |

---

## 📁 Estructura básica

```
src/
├── app/
│   ├── app.module.ts           # Módulo raíz
│   ├── app.controller.ts       # Controlador principal
│   └── ...
├── config/
│   ├── config.module.ts        # Módulo de configuración
│   ├── typeorm.config.ts       # Configuración TypeORM
│   ├── nodemailer.config.ts    # Configuración de correo
│   ├── otp.config.ts           # Configuración OTP
│   └── ...
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── transactions/
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── financial-accounts/
│   │   ├── financial-accounts.controller.ts
│   │   ├── financial-accounts.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── file-upload/
│   │   ├── file-upload.service.ts
│   │   └── dto/
│   ├── admin/
│   │   ├── discounts/
│   │   ├── profiles/
│   │   ├── transaction/
│   │   └── users/
│   ├── webhook/
│   └── ...
├── service/
│   ├── mailer.service.ts
│   └── cloudinary/
├── common/
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   ├── user.decorator.ts
│   ├── decorators/
│   ├── guards/
│   ├── interfaces/
│   ├── middlewares/
│   ├── pipes/
│   └── validators/
├── database/
│   ├── data-source.ts
│   └── migrations/
│       └── 1758803504269-InitialSchema.ts
└── enum/
   ├── admin-status.enum.ts
   ├── platform.enum.ts
   ├── user-role.enum.ts
   └── virtual-bank.enum.ts
```
> Cada módulo suele tener controladores, servicios, entidades y DTOs propios. La estructura está pensada para escalar y mantener el código organizado por dominio.

---

## 🔐 Variables de entorno

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgres://...
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_CLOUD_API_KEY=...
CLOUDINARY_CLOUD_API_SECRET=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

---

## 🧬 Migraciones con TypeORM

En desarrollo, el esquema se sincroniza automáticamente. En producción, usá migraciones:

- Generar migración:
  ```bash
  npm run migration:generate -- src/database/migrations/Nombre
  ```
- Ejecutar migraciones:
  ```bash
  npm run migration:run
  ```
- Revertir última migración:
  ```bash
  npm run migration:revert
  ```

---

## 📝 Notas clave

- `ValidationPipe` global para DTOs
- OTP por email (Brevo SMTP)
- Swagger solo fuera de producción
- No usar `synchronize: true` en producción
- Conexión a PostgreSQL por `DATABASE_URL`

---

## 🚀 Despliegue en Render

1. Crea servicio web en [Render](https://dashboard.render.com) usando Dockerfile.
2. Configura variables de entorno en el dashboard (ver arriba).
3. Build: `npm run build`  |  Start: `npm run start:prod`
4. Health check: `/health`
5. Ejecuta migraciones tras el deploy:
   ```bash
   npm run migrate:prod
   ```

---
