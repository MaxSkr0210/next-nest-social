import { Injectable, UnauthorizedException, BadRequestException, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginUserDto, RefreshTokenDto } from "./dto";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { CreateUserDto, PrismaService } from "../../../libs/common";
import { User } from "@/generated/prisma";
import config, { IConfig } from "@/config/configuration";

@Injectable()
export class AuthService {
    private config: IConfig;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        @Inject("users_queue") private readonly usersClient: ClientProxy,
    ) {
        this.config = config();
    }

    async createUser(data: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userResponse = await firstValueFrom(
            this.usersClient.send({ cmd: "create_user" }, { ...data, password: hashedPassword }),
        );

        if (!userResponse || !userResponse.id) {
            throw new BadRequestException("Failed to create user in users service");
        }

        const payload = { sub: userResponse.id, email: userResponse.email };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(userResponse.id);

        return {
            id: userResponse.id,
            email: userResponse.email,
            accessToken,
            refreshToken,
        };
    }

    async loginUser(data: LoginUserDto) {
        const user = await firstValueFrom(this.usersClient.send({ cmd: "find_user_by_criteria" }, data));

        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(user.id);

        return { accessToken, refreshToken };
    }

    async refreshToken(data: RefreshTokenDto) {
        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token: data.refreshToken },
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        const user = await firstValueFrom(
            this.usersClient.send({ cmd: "find_user_by_id" }, { id: tokenRecord.userId }),
        );

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = this.generateAccessToken(payload);
        const newRefreshToken = await this.generateRefreshToken(user.id);
        await this.prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

        return { accessToken, refreshToken: newRefreshToken };
    }

    private generateAccessToken(payload: { sub: User["id"]; email: User["email"] }) {
        return this.jwtService.sign(payload, {
            secret: this.config.JWT.ACCESS_TOKEN.SECRET,
            expiresIn: this.config.JWT.ACCESS_TOKEN.EXPIRES_IN,
        });
    }

    private async generateRefreshToken(userId: User["id"]) {
        const token = this.jwtService.sign(
            { sub: userId },
            {
                secret: this.config.JWT.REFRESH_TOKEN.SECRET,
                expiresIn: this.config.JWT.REFRESH_TOKEN.EXPIRES_IN,
            },
        );

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });

        return token;
    }
}
