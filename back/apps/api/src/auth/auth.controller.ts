import { Body, Controller, Inject, NotFoundException, Post, Res, UseGuards } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { Response } from "express";
import configuration from "../../../../config/configuration";
import { IAuthResponse } from "../types/auth.types";
import { AccessTokenGuard } from "./guards/access_token.guard";
import { CreateUserDto } from "@/libs/dto";
import { User } from "@/generated/prisma";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("/auth")
export class AuthController {
    constructor(
        @Inject("users_queue") private readonly usersServiceClient: ClientProxy,
        @Inject("auth_queue") private readonly authServiceClient: ClientProxy,
    ) {}

    @Post("/register")
    async registration(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const { COOKIE } = configuration();

        const register = await firstValueFrom<IAuthResponse>(
            this.authServiceClient.send({ cmd: "register_user" }, data),
        );

        res.cookie(COOKIE.REFRESH_TOKEN.NAME, register.refreshToken, {
            httpOnly: COOKIE.REFRESH_TOKEN.HTTP_ONLY,
            secure: COOKIE.REFRESH_TOKEN.SECURE,
            maxAge: COOKIE.REFRESH_TOKEN.MAX_AGE,
            domain: COOKIE.REFRESH_TOKEN.DOMAIN,
        })
            .cookie(COOKIE.ACCESS_TOKEN.NAME, register.accessToken, {
                httpOnly: COOKIE.ACCESS_TOKEN.HTTP_ONLY,
                secure: COOKIE.ACCESS_TOKEN.SECURE,
                maxAge: COOKIE.ACCESS_TOKEN.MAX_AGE,
                domain: COOKIE.ACCESS_TOKEN.DOMAIN,
            })
            .json(register);
    }

    @UseGuards(AccessTokenGuard)
    @Post("/login")
    async login(@Body() data: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        const { COOKIE } = configuration();
        const user = await firstValueFrom<User>(this.usersServiceClient.send({ cmd: "login_user" }, data));

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const register = await firstValueFrom<IAuthResponse>(
            this.authServiceClient.send({ cmd: "auth/authorization" }, user),
        );

        res.cookie(COOKIE.REFRESH_TOKEN.NAME, register.refreshToken, {
            httpOnly: COOKIE.REFRESH_TOKEN.HTTP_ONLY,
            secure: COOKIE.REFRESH_TOKEN.SECURE,
            maxAge: COOKIE.REFRESH_TOKEN.MAX_AGE,
            domain: COOKIE.REFRESH_TOKEN.DOMAIN,
        })
            .cookie(COOKIE.ACCESS_TOKEN.NAME, register.accessToken, {
                httpOnly: COOKIE.ACCESS_TOKEN.HTTP_ONLY,
                secure: COOKIE.ACCESS_TOKEN.SECURE,
                maxAge: COOKIE.ACCESS_TOKEN.MAX_AGE,
                domain: COOKIE.ACCESS_TOKEN.DOMAIN,
            })
            .json(register);
    }

    @Post("/refresh")
    async refreshToken(
        @Body()
        data: {
            refreshToken: string;
        },
        @Res({ passthrough: true }) res: Response,
    ) {
        const { COOKIE } = configuration();
        const r = await firstValueFrom<IAuthResponse>(this.authServiceClient.send({ cmd: "auth/refresh" }, data));

        if (!r) {
            return res.status(401).json({ message: "User not found" });
        }

        res.cookie(COOKIE.REFRESH_TOKEN.NAME, r.refreshToken, {
            httpOnly: COOKIE.REFRESH_TOKEN.HTTP_ONLY,
            secure: COOKIE.REFRESH_TOKEN.SECURE,
            maxAge: COOKIE.REFRESH_TOKEN.MAX_AGE,
            domain: COOKIE.REFRESH_TOKEN.DOMAIN,
        })
            .cookie(COOKIE.ACCESS_TOKEN.NAME, r.accessToken, {
                httpOnly: COOKIE.ACCESS_TOKEN.HTTP_ONLY,
                secure: COOKIE.ACCESS_TOKEN.SECURE,
                maxAge: COOKIE.ACCESS_TOKEN.MAX_AGE,
                domain: COOKIE.ACCESS_TOKEN.DOMAIN,
            })
            .json(r);
    }
}
