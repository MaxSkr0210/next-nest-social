import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import configuration from "../../../config/configuration";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    app.setGlobalPrefix("/api");
    app.enableCors({
        origin: ["http://localhost:3001", "http://mskrinnik.ru"],
        credentials: true,
    });

    await app.listen(configuration().API_PORT);
}

bootstrap();
