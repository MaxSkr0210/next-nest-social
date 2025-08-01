import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "../../../libs/common";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
