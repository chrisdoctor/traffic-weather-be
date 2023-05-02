import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // only for testing purposes, to allow access to traffic-weather frontend
  await app.listen(5000);
}
bootstrap();
