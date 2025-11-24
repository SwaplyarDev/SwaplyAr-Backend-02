# Etapa 1: Construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala todas las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Copia el código fuente
COPY . .

# Compila la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS production

# Instala dependencias del sistema necesarias
RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./

# Instala solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copia el código compilado de la etapa anterior
COPY --from=builder /app/dist ./dist

# Crea un usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Cambia la propiedad de los archivos
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expone el puerto (se usará la variable de entorno PORT)
EXPOSE 8081

ENTRYPOINT ["dumb-init", "--"]

# Ejecuta migraciones y luego inicia la aplicación
CMD ["sh", "-c", "npm run migration:run:prod && node dist/main.js"]
