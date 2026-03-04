import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';  // Add this import

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend access
  app.enableCors();

  // Add ValidationPipe with transformation enabled
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  // This is CRITICAL for converting strings to numbers
      transformOptions: {
        enableImplicitConversion: true,  // This helps with automatic conversion
      },
    }),
  );

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',  // This makes files accessible at /uploads/filename
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();