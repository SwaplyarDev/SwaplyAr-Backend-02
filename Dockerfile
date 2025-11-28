FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instala todas las dependencias (incluyendo dev) para compilar
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./

# Instala solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copia el build desde la etapa builder (incluyendo templates si nest-cli.json los copió)
COPY --from=builder /app/dist ./dist

# Asegurarse de que los templates estén presentes (respaldo por si nest-cli.json no los copió)
COPY --from=builder /app/src/modules/mailer/templates ./dist/modules/mailer/templates

# Verificar que los templates existan
RUN ls -la /app/dist/modules/mailer/templates/email/auth/ || echo "WARNING: Templates not found"

RUN addgroup -g 1001 -S nodejs \
	&& adduser -S nestjs -u 1001 \
	&& chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

# Ejecuta migraciones y arranca la app (sin reconstruir)
CMD ["npm", "run", "start:prod:migrate"]
