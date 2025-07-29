import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateUserDto, FindUserByCriteriaDto, PrismaService } from "../../../libs/common";
import { User } from "@/generated/prisma";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: CreateUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: data.email }, { username: data.username }],
            },
        });

        if (existingUser) {
            throw new BadRequestException("User with this email already exists");
        }

        const user = await this.prisma.user.create({
            data,
        });

        return { id: user.id, email: user.email, password: user.password };
    }

    async findUsersByCriteria(data: FindUserByCriteriaDto) {
        return this.prisma.user.findMany({ where: data });
    }

    async findUserById(id: User["id"]) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? { id: user.id, email: user.email, password: user.password } : null;
    }
}
