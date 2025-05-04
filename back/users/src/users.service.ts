import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(user: CreateUserDto): Promise<Omit<User, 'password'>> {
        const u = await this.findUserByFields({
            email: user.email,
        });

        if (u) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = await this.userRepository.save({
            ...user,
            password: hashedPassword,
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async findUserByFields(fields: Partial<Omit<User, 'id'>>): Promise<User> {
        const user = await this.userRepository.findOne({
            where: fields,
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        console.log(user);

        return user;
    }
}
