import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: configuration().rabbitmq.urls,
        queue: 'users_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
