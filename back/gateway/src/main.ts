import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.use(cookieParser());
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  console.log(process.env.RABBITMQ_URLS);

  await app.listen(3000);
}

bootstrap();
