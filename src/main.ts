// /src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // headers de seguridad
  app.use(helmet());

  // hooks de apagado limpios (para cerrar DB, workers, etc.)
  app.enableShutdownHooks();

  // 0. Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // lanza error si llegan propiedades extra
      transform: true, // convierte payloads a instancias de clases DTO
    }),
  );

  // 1. Prefijo global
  app.setGlobalPrefix('api/v2');

  // 2. CORS múltiple
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

  // 3. Swagger UI en /api/v2
  const config = new DocumentBuilder()
    .setTitle('SwaplyArApi')
    .setDescription('Documentación generada automáticamente')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v2', app, document);

  await app.listen(3001);
  console.log('Server corriendo en http://localhost:3001/api/v2');
}

void bootstrap();
