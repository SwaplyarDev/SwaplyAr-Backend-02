# Guía de Migraciones (TypeORM)

**Archivo principal:** `src/database/data-source.ts`
**Objetivo:** Mantener el esquema de la base usando migraciones. Nunca usar `synchronize: true` en producción.

---

## 1. Comandos básicos (scripts en package.json)

| Acción | Comando |
|--------|---------|
| Generar automática (diff entidades) | `npm run mig:gen -- src/database/migrations/NombreDescriptivo` |
| Crear migración vacía (manual) | `npm run mig:create -- src/database/migrations/NombreManual` |
| Aplicar migraciones pendientes | `npm run mig:run` |
| Revertir la última | `npm run mig:revert` |
| Mostrar estado | `npm run mig:show` |

> Nota: Todo lo que viene después de `--` son argumentos propios del CLI de TypeORM.

---

## 2. Migración inicial

1. Asegúrate de que no existan migraciones previas (o bórralas si vas a reiniciar).
2. Esquema limpio (DB vacía).
3. Define tus entidades en `src/**/*.entity.ts`.
4. Ejecuta:
   ```bash
   npm run mig:gen -- src/database/migrations/InitialSchema
````

5. Revisa el archivo generado en `src/database/migrations`.
6. Ejecuta:

   ```bash
   npm run mig:run
   ```
7. Si todo está correcto, commitea la migración.

---

## 3. Migraciones por cambios

Flujo cada vez que modificas o agregas entidades:

1. Modifica o agrega entidades en `src/**/*.entity.ts`.
2. (Opcional) Ejecuta:

   ```bash
   npm run mig:gen -- src/database/migrations/NombreCambio
   ```
3. Revisa el SQL generado (verifica que no elimine columnas críticas a menos que sea intencional).
4. Aplica cambios:

   ```bash
   npm run mig:run
   ```
5. Ejecuta pruebas locales.
6. Commit: incluye entidades + migración.

---

## 4. Entornos

* **Desarrollo:** Generas y aplicas normalmente.
* **Producción (Servidor tradicional):**

  1. Compila: `npm run build`
  2. Asegúrate de tener `DATABASE_URL` definida.
  3. Ejecuta: `npm run mig:run`
     (El `DataSource` ya apunta a rutas `dist` si `NODE_ENV=production`).

* **Producción (Docker):**

  Para ejecutar migraciones dentro del contenedor de producción:

  ```bash
  # Ejecutar migraciones en el contenedor 'app' ya corriendo
  docker compose --profile production exec app npm run migration:run:prod
  ```

  Para revertir migraciones:
  ```bash
  docker compose --profile production exec app npm run migration:revert:prod
  ```

---

## 5. Revertir

* Solo la última migración:

  ```bash
  npm run mig:revert
  ```
* Para revertir varias, repite el comando (precaución en prod).

---

## 6. Migración manual vs automática

* **Automática (`migration:generate`)**: basadas en diferencias de metadatos de entidades.
* **Manual (`migration:create`)**: útil si la automática no detecta correctamente cambios complejos (funciones SQL, índices específicos).

---

## 7. Buenas prácticas

* Nunca edites migraciones ya aplicadas en producción.
* Nombra las migraciones claramente: `AddUserProfile`, `AlterTransactionAddStatus`.
* Una migración por grupo lógico de cambios.
* Revisa siempre antes de aplicar: columnas DROP, cambios de tipo, constraints.
* No mezclar datos de prueba en migraciones; si necesitas datos seed, usa scripts separados.

---

## 8. Problemas comunes

1. **No genera cambios:**

   * Limpia caché de compilación.
   * Verifica que las entidades están incluidas en la glob correcta.

2. **En prod no encuentra entidades:**

   * Verifica la ruta en `data-source.ts` contempla `.js` en dist.

3. **Error SSL:**

   * Configura `NODE_ENV=production` solo en entornos reales de producción.

4. **Diferencias repetidas:**

   * Algunas entidades tienen defaults distintos a los existentes en DB. Ajusta manualmente y crea migración manual si es necesario.

---

## 9. Tips de naming rápido

* **Windows PowerShell (timestamp):**

  ```powershell
  npm run mig:gen -- src/database/migrations/$(Get-Date -UFormat %Y%m%d%H%M%S)-AddFoo
  ```
* **Linux/macOS:**

  ```bash
  npm run mig:gen -- src/database/migrations/$(date +%Y%m%d%H%M%S)-AddFoo
  ```

> También puedes usar nombres cortos descriptivos si prefieres.

---

## 10. Verificación rápida post-migración

* Ejecuta:

  ```bash
  npm run mig:show
  ```

  Debe listar todas las migraciones como ejecutadas.

* Conecta con un cliente (psql o GUI) y verifica que las tablas y columnas nuevas estén correctas.

---

## 11. Checklist antes de deploy

* [ ] Commit incluye la nueva migración
* [ ] `npm run build` OK
* [ ] Variables de entorno de DB correctas
* [ ] Backup de DB (si es crítico)
* [ ] Ejecutar `npm run mig:run` en el servidor
