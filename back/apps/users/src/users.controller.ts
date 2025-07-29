import { Controller } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { CreateUserDto, FindUserByCriteriaDto, FindUserByIdDto } from "@/libs/dto";

@Controller("")
export class UsersController {
    constructor(private usersService: UsersService) {}
    @MessagePattern({ cmd: "create_user" })
    async createUser(@Payload() data: CreateUserDto, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            console.log(data);
            const result = await this.usersService.createUser(data);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            channel.ack(originalMsg);
            throw error;
        }
    }

    @MessagePattern({ cmd: "find_user_by_criteria" })
    async findUsersByCriteria(@Payload() data: FindUserByCriteriaDto, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.usersService.findUsersByCriteria(data);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            channel.ack(originalMsg);
            throw error;
        }
    }

    @MessagePattern({ cmd: "find_user_by_id" })
    async findUserById(@Payload() data: FindUserByIdDto, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.usersService.findUserById(data.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            channel.ack(originalMsg);
            throw error;
        }
    }
}
