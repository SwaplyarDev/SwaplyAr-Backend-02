# Docker: Entorno de Desarrollo y Producción SwaplyAr

Este documento describe cómo usar y mantener el stack Docker definido en `docker-compose.yml`.

## Servicios

| Servicio        | Puerto Host | Descripción | Volumen Persistente |
|-----------------|-------------|-------------|----------------------|
| postgres        | `${POSTGRES_PORT:-5432}` | Base de datos principal | `postgres_data` |
| pgadmin         | `${PGADMIN_PORT:-5050}`  | Consola web para PostgreSQL | `pgadmin_data` |
| app             | `${APP_PORT:-3000}`      | Aplicación NestJS (Producción) | - |
| postgres_test   | `${POSTGRES_TEST_PORT:-5438}` | Base de datos aislada para pruebas (profile `test`) | `postgres_test_data` |

## Variables de entorno clave (.env)

```
POSTGRES_DB=swaplyar
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_PORT=5432
DATABASE_URL=postgres://postgres:admin@localhost:5432/swaplyar

POSTGRES_TEST_DB=testdb
POSTGRES_TEST_USER=testuser
POSTGRES_TEST_PASSWORD=testpass
POSTGRES_TEST_PORT=5438
DATABASE_TEST_URL=postgres://testuser:testpass@localhost:5438/testdb

PGADMIN_DEFAULT_EMAIL=admin@swaplyar.com
PGADMIN_DEFAULT_PASSWORD=admin_password
PGADMIN_PORT=5050

APP_PORT=3000
```

## Comandos básicos

### Entorno de Producción (App + DB)

Para levantar todo el sistema (Base de datos + Aplicación + Migraciones automáticas):

```bash
docker compose up -d --build
```

Esto realizará lo siguiente:
1. Construirá la imagen de la aplicación (multi-stage build).
2. Iniciará la base de datos `postgres`.
3. Esperará a que la base de datos esté saludable.
4. Iniciará la aplicación `app`.
5. **Ejecutará automáticamente las migraciones pendientes** antes de iniciar el servidor.

Ver logs de la aplicación:
```bash
docker compose logs -f app
```

### Entorno de Desarrollo (Solo DB)

Si solo necesitas la base de datos para desarrollar localmente (corriendo `npm run start:dev` en tu máquina):

```bash
docker compose up -d postgres pgadmin
```

### Base de datos de pruebas (profile test)

```bash
docker compose --profile test up -d postgres_test
```

### Gestión de Contenedores

Reiniciar servicios:
```bash
docker compose restart
```

Detener y eliminar contenedores conservando datos:
```bash
docker compose down
```

Detener y eliminar TODO (incluyendo datos):
```bash
docker compose down -v
```

## Migraciones en Producción

El contenedor de la aplicación está configurado para ejecutar migraciones automáticamente al inicio.
El comando que se ejecuta es `npm run start:prod:migrate`, el cual:
1. Ejecuta `migration:run` usando el código compilado en `dist/`.
2. Si las migraciones son exitosas, inicia la aplicación con `node dist/main.js`.

## Conexiones

Aplicación Nest (desarrollo local):
```
DATABASE_URL=postgres://postgres:admin@localhost:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-swaplyar}
```

Aplicación Nest (dentro de Docker):
La aplicación se conecta automáticamente usando el nombre del servicio `postgres` como host.

pgAdmin:
- URL: http://localhost:5050
- Email: `PGADMIN_DEFAULT_EMAIL`
- Password: `PGADMIN_DEFAULT_PASSWORD`

## Healthchecks
Cada servicio Postgres incluye `pg_isready` para que dependencias (como pgAdmin o la App) esperen a que la base esté lista.

## Solución de Problemas

| Problema | Causa | Solución |
|----------|-------|----------|
| Error de conexión en App | DB no lista o credenciales mal | Revisar logs: `docker compose logs app`. Verificar variables en `.env`. |
| Migraciones fallan | Error en archivos de migración | Revisar logs. Asegurar que las migraciones compiladas (.js) estén en `dist`. |
| Puerto ocupado | Otro servicio en el host | Cambiar puertos en `.env` (ej. APP_PORT=3001). |

---
Última actualización: {REPLACE_DATE}
