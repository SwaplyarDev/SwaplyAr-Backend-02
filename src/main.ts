// /src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 1. Seguridad HTTP con Helmet
  app.use(helmet());

  // 2. Hooks de apagado limpio para conexiones DB, colas, etc.
  app.enableShutdownHooks();

  // 3. Validación global de request inputs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log('❌ Errores de validación:', errors); // <-- DEBUG ACÁ
        return new Error(`Errores de validación:`);
      },
    }),
  );

  // 4. Prefijo global para rutas
  const apiPrefix = 'api/v2';
  app.setGlobalPrefix(apiPrefix);

  // 5. Configuración de CORS con lista blanca
  const whitelist = [
    'https://www.swaplyar.com',
    'https://swaplyar-swaplyar.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  app.enableCors({
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) =>
      !origin || whitelist.includes(origin)
        ? callback(null, true)
        : callback(new Error('CORS origin no permitido'), false),
  });

  // 6. Documentación Swagger en la misma ruta que el API
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SwaplyArApi')
    .setDescription('Documentación automática de la API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(apiPrefix, app, document);

  // 7. Lectura del puerto de entorno, con puerto por defecto
  const port = parseInt(configService.get<string>('PORT', '3001'), 10);
  const host = '0.0.0.0'; // necesario para que Render exponga tu app correctamente :contentReference[oaicite:1]{index=1}

  await app.listen(port, host);
  console.log(
    `🚀 Server corriendo en http://${host}:${port}/${apiPrefix}`,
  );
}

void bootstrap();