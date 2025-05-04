import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, FindUserDto } from './dto/create-user.dto';

@Controller()
export class UsersController {
    constructor(private usersService: UsersService) {}
    @EventPattern('users')
    users(@Payload() data: number[], @Ctx() context: RmqContext) {
        console.log(data);
        console.log(context);
    }

    @MessagePattern({ cmd: 'create_user' })
    async createUser(@Payload() data: CreateUserDto) {
        return await this.usersService.createUser(data);
    }

    @MessagePattern({ cmd: 'find_user' })
    async findUserByField(@Payload() data: FindUserDto) {
        return await this.usersService.findUserByFields(data);
    }
}
