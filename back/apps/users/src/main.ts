import { NestFactory } from "@nestjs/core";
import { UsersModule } from "./users.module";
import { RmqService } from "../../../libs/common";

async function bootstrap() {
    const app = await NestFactory.create(UsersModule);
    const sharedService = app.get(RmqService);

    app.connectMicroservice(sharedService.getRmqOptions("users_queue"));
    await app.startAllMicroservices();
}
bootstrap();
