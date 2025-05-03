import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { Token } from './entities/token.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: configuration().rabbitmq.urls,
          queue: 'users_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.name,
      entities: [Token],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
