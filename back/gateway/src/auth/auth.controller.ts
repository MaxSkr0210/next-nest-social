import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import configuration from '../config/configuration';
import { IUser } from '../types/user.types';
import { IAuthResponse } from '../types/auth.types';

@Controller('/auth')
export class AuthController {
    constructor(
        @Inject('USERS_SERVICE') private readonly usersServiceClient: ClientProxy,
        @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
    ) {}

    @Post('/register')
    async registration(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const { cookie } = configuration();
        console.log(data);
        const user = await firstValueFrom<IUser>(
            this.usersServiceClient.send({ cmd: 'create_user' }, data),
        );

        const register = await firstValueFrom<IAuthResponse>(
            this.authServiceClient.send({ cmd: 'auth/register' }, user),
        );

        res.cookie(cookie.refreshToken.name, register.refreshToken, {
            httpOnly: cookie.refreshToken.httpOnly,
            secure: cookie.refreshToken.secure,
            maxAge: cookie.refreshToken.maxAge,
            domain: cookie.refreshToken.domain,
        })
            .cookie(cookie.accessToken.name, register.accessToken, {
                httpOnly: cookie.accessToken.httpOnly,
                secure: cookie.accessToken.secure,
                maxAge: cookie.accessToken.maxAge,
                domain: cookie.accessToken.domain,
            })
            .json(register);
    }

    @Post('/login')
    async login(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: Response) {
        const { cookie } = configuration();
        const user = await firstValueFrom<IUser>(
            this.usersServiceClient.send(
                { cmd: 'find_user' },
                {
                    username: data.username,
                },
            ),
        );

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const register = await firstValueFrom<IAuthResponse>(
            this.authServiceClient.send({ cmd: 'auth/authorization' }, user),
        );

        res.cookie(cookie.refreshToken.name, register.refreshToken, {
            httpOnly: cookie.refreshToken.httpOnly,
            secure: cookie.refreshToken.secure,
            maxAge: cookie.refreshToken.maxAge,
            domain: cookie.refreshToken.domain,
        })
            .cookie(cookie.accessToken.name, register.accessToken, {
                httpOnly: cookie.accessToken.httpOnly,
                secure: cookie.accessToken.secure,
                maxAge: cookie.accessToken.maxAge,
                domain: cookie.accessToken.domain,
            })
            .json(register);
    }

    @Post('/refresh')
    async refreshToken(
        @Body()
        data: {
            refreshToken: string;
        },
        @Res({ passthrough: true }) res: Response,
    ) {
        const { cookie } = configuration();
        const r = await firstValueFrom<IAuthResponse>(
            this.authServiceClient.send({ cmd: 'auth/refresh' }, data),
        );

        if (!r) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.cookie(cookie.refreshToken.name, r.refreshToken, {
            httpOnly: cookie.refreshToken.httpOnly,
            secure: cookie.refreshToken.secure,
            maxAge: cookie.refreshToken.maxAge,
            domain: cookie.refreshToken.domain,
        })
            .cookie(cookie.accessToken.name, r.accessToken, {
                httpOnly: cookie.accessToken.httpOnly,
                secure: cookie.accessToken.secure,
                maxAge: cookie.accessToken.maxAge,
                domain: cookie.accessToken.domain,
            })
            .json(r);
    }
}
