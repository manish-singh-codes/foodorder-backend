// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://foodorder-fe.netlify.app',
  ],
  credentials: true,
});

  await app.listen(port);
  console.log(`🚀 GraphQL API: http://localhost:${port}/graphql`);
}
bootstrap();
