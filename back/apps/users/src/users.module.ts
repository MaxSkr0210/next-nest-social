import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaModule, RmqModule } from "../../../libs/common";

@Module({
    imports: [
        RmqModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
