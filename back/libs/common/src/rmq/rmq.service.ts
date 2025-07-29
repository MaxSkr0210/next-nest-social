import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";
import { RmqServiceInterface } from "../types/rmqService.type";
import config from "@/config/configuration";

@Injectable()
export class RmqService implements RmqServiceInterface {
    constructor(private readonly configService: ConfigService) {}

    public getRmqOptions(queue: string): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: config().RABBITMQ.URLS,
                noAck: false,
                queue,
                queueOptions: {
                    durable: true,
                },
            },
        };
    }

    acknowledgeMessage(context: RmqContext) {
        const channel = context.getChannelRef();
        const message = context.getMessage();
        channel.ack(message);
    }
}
