import { NestFactory } from "@nestjs/core";
import { AuthModule } from "./auth.module";
import { RmqService } from "../../../libs/common";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);
    const sharedService = app.get(RmqService);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.connectMicroservice(sharedService.getRmqOptions("auth_queue"));
    await app.startAllMicroservices();
}
bootstrap();
