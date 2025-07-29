import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { PrismaModule, RmqModule } from "../../../libs/common";

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),

        RmqModule,
        RmqModule.registerRmq("users_queue", "users_queue"),
        PrismaModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
