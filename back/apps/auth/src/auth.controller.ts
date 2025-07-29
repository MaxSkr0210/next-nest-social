import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload, Ctx, RmqContext } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { LoginUserDto, RefreshTokenDto } from "./dto";
import { CreateUserDto } from "@/libs/dto";

@Controller()
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) {}

    @MessagePattern({ cmd: "register_user" })
    async createUser(@Payload() data: CreateUserDto, @Ctx() context: RmqContext) {
        this.logger.log(`Received create_user message: ${JSON.stringify(data)}`);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.authService.createUser(data);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            this.logger.error(`Error in create_user: ${error.message}`);
            channel.ack(originalMsg);
            throw error;
        }
    }

    @MessagePattern({ cmd: "login_user" })
    async loginUser(@Payload() data: LoginUserDto, @Ctx() context: RmqContext) {
        this.logger.log(`Received login_user message: ${JSON.stringify(data)}`);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.authService.loginUser(data);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            this.logger.error(`Error in login_user: ${error.message}`);
            channel.ack(originalMsg);
            throw error;
        }
    }

    @MessagePattern({ cmd: "refresh_token" })
    async refreshToken(@Payload() data: RefreshTokenDto, @Ctx() context: RmqContext) {
        this.logger.log(`Received refresh_token message: ${JSON.stringify(data)}`);
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.authService.refreshToken(data);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            this.logger.error(`Error in refresh_token: ${error.message}`);
            channel.ack(originalMsg);
            throw error;
        }
    }
}
