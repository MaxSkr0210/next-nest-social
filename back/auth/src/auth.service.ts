import { Inject, Injectable } from '@nestjs/common';
import { AuthLoginDTO } from './dtos/auth.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
        @Inject('USERS_SERVICE') private readonly usersServiceClient: ClientProxy,
    ) {}
    async generateAndSaveTokens(user: AuthLoginDTO) {
        const payload = {
            sub: user.id,
            email: user.email,
        };

        const refreshToken = await this.generateToken({
            payload,
            options: {
                expiresIn: '30d',
                secret: 'refresh_secret',
            },
        });
        const accessToken = await this.generateToken({
            payload,
            options: {
                expiresIn: '15m',
                secret: 'access_secret',
            },
        });

        await this.tokenRepository.save({
            userId: user.id,
            refreshToken,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async findUserByToken(refreshToken: string) {
        const res = await this.tokenRepository.findOne({
            where: {
                refreshToken,
            },
        });

        if (!res) {
            return null;
        }

        const user = await firstValueFrom(
            this.usersServiceClient.send({ cmd: 'find_user' }, { id: res.userId }),
        );

        return user;
    }

    async deleteToken(refreshToken: string) {
        return await this.tokenRepository.delete({
            refreshToken,
        });
    }

    private async generateToken({
        payload,
        options,
    }: {
        payload: {
            sub: number;
            email: string;
        };
        options: JwtSignOptions;
    }) {
        return await this.jwtService.signAsync(payload, options);
    }
}
