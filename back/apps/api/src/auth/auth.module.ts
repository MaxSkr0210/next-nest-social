import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RmqModule } from "../../../../libs/common";

@Module({
    imports: [RmqModule.registerRmq("auth_queue", "auth_queue"), RmqModule.registerRmq("users_queue", "users_queue")],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
