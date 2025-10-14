# Usa una imagen base de Node.js optimizada para producción
FROM node:20-alpine AS base

# Instala dependencias del sistema necesarias para NestJS y PostgreSQL
RUN apk add --no-cache dumb-init

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package*.json ./

# Instala dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copia el código compilado
FROM base AS production
COPY --from=base /app/node_modules ./node_modules
COPY dist ./dist

# Crea un usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Cambia la propiedad de los archivos al usuario nestjs
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expone el puerto (Render lo asigna dinámicamente)
EXPOSE 3001

# Usa dumb-init para manejar señales correctamente
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/src/main.js"]
