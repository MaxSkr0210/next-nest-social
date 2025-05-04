import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import configuration from './config/configuration';
import { AuthModule } from './auth.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
        transport: Transport.RMQ,
        options: {
            urls: configuration().rabbitmq.urls,
            queue: 'auth_queue',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.listen();
}
bootstrap();
