import { RmqContext, RmqOptions } from "@nestjs/microservices";

export interface RmqServiceInterface {
    getRmqOptions(queue: string): RmqOptions;
    acknowledgeMessage(context: RmqContext): void;
}
