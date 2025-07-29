import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { RmqService } from "./rmq.service";
import config from "@/config/configuration";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env",
        }),
    ],
    providers: [RmqService],
    exports: [RmqService],
})
export class RmqModule {
    static registerRmq(service: string, queue: string): DynamicModule {
        const providers = [
            {
                provide: service,
                useFactory: () => {
                    return ClientProxyFactory.create({
                        transport: Transport.RMQ,
                        options: {
                            urls: config().RABBITMQ.URLS,
                            queue,
                            queueOptions: {
                                durable: true,
                            },
                        },
                    });
                },
                inject: [ConfigService],
            },
        ];

        return {
            module: RmqModule,
            providers,
            exports: providers,
        };
    }
}
