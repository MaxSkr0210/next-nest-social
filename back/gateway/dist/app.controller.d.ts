import { ClientProxy } from "@nestjs/microservices";
export declare class AppController {
    private readonly taskServiceClient;
    constructor(taskServiceClient: ClientProxy);
    auth(): void;
}
