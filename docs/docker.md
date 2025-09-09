# Docker: Entorno de Desarrollo SwaplyAr

Este documento describe cómo usar y mantener el stack Docker definido en `docker-compose.yml`.

## Servicios

| Servicio        | Puerto Host | Descripción | Volumen Persistente |
|-----------------|-------------|-------------|----------------------|
| postgres        | `${POSTGRES_PORT:-5432}` | Base de datos principal | `postgres_data` |
| pgadmin         | `${PGADMIN_PORT:-5050}`  | Consola web para PostgreSQL | `pgadmin_data` |
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
```

Notas:
- Puedes cambiar `POSTGRES_PORT` si ya tienes otro Postgres corriendo.
- `DATABASE_URL` puede omitirse: el código intentará construirla con las variables POSTGRES_*.
- En entorno test (`NODE_ENV=test`) se usa `DATABASE_TEST_URL` o se genera con variables POSTGRES_TEST_*.

## Comandos básicos

Iniciar Postgres y pgAdmin:
```
docker compose up -d postgres pgadmin
```

Solo Postgres:
```
docker compose up -d postgres
```

Base de datos de pruebas (profile test):
```
docker compose --profile test up -d postgres_test
```

Ver logs:
```
docker compose logs -f postgres
```

Reiniciar servicios:
```
docker compose restart
```

Detener y eliminar contenedores conservando datos:
```
docker compose down
```

Detener y eliminar TODO (incluyendo datos):
```
docker compose down -v
```

Limpiar solo la DB de test (recrear desde cero):
```
docker compose rm -sf postgres_test
# Luego si deseas eliminar el volumen (nombre real puede variar):
docker volume rm $(docker volume ls -q | findstr /R /C:"postgres_test_data")
```

## Conexiones

Aplicación Nest (desarrollo):
```
DATABASE_URL=postgres://postgres:admin@localhost:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-swaplyar}
```

DBeaver / Cliente externo:
```
Host: localhost
Port: 5432 (o POSTGRES_PORT)
Database: swaplyar
User: postgres
Password: admin
```

pgAdmin:
- URL: http://localhost:5050
- Email: `PGADMIN_DEFAULT_EMAIL`
- Password: `PGADMIN_DEFAULT_PASSWORD`
- Para registrar el servidor en pgAdmin: Host `postgres`, Port `5432`, User/Password según .env.

## Healthchecks
Cada servicio Postgres incluye `pg_isready` para que dependencias (como pgAdmin) esperen a que la base esté lista.

## Flujo típico de desarrollo
1. Ajusta/crea `.env` con tus credenciales.
2. Levanta Postgres: `docker compose up -d postgres`.
3. Ejecuta la app: `npm run start:dev`.
4. (Opcional) Usa pgAdmin o DBeaver para inspeccionar datos.
5. Para pruebas e2e: `docker compose --profile test up -d postgres_test && NODE_ENV=test npm test`.

## Estrategia de datos
- Volumen `postgres_data` persiste tus tablas entre reinicios.
- Para un reset completo: `docker compose down -v` (elimina datos).
- Para aislar pruebas, usa siempre la DB de test; evita correr tests destructivos contra la principal.

## Buenas prácticas
- No reutilizar este archivo para producción sin:
  - Backups automáticos
  - Usuarios separados (principio de mínimos privilegios)
  - SSL/TLS y políticas de red
  - Monitoreo y alertas
- No commitear `.env` con secretos reales. Crea una plantilla (`.env.example`).
- Usa migraciones en lugar de `synchronize` en producción.

## Problemas comunes
| Problema | Causa | Solución |
|----------|-------|----------|
| Puerto 5432 ocupado | Otro Postgres local | Cambia POSTGRES_PORT en `.env` (ej 5433) y recrea contenedor |
| pgAdmin no ve Postgres | Healthcheck no ok aún | Esperar o revisar `docker compose logs postgres` |
| Tests pisan datos | Usando DB principal | Asegura `NODE_ENV=test` y levanta `postgres_test` |
| Error auth | Credenciales cambiadas | Borrar contenedor y volumen: `docker compose down -v` y volver a subir |

## Extensiones / Personalización
Puedes montar scripts de inicialización en `postgres` agregando:
```
    volumes:
      - ./docker/init:/docker-entrypoint-initdb.d
```
Archivos `.sql` o `.sh` en esa carpeta se ejecutarán al crear el volumen por primera vez.

## Futuras mejoras sugeridas
- Añadir contenedor para backups programados (pg_dump) usando `cron`.
- Añadir servicio Adminer como alternativa ligera a pgAdmin.
- Usar red externa compartida si múltiples proyectos necesitan la misma DB.

---
Última actualización: {REPLACE_DATE}
