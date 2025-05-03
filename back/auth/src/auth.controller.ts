import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthLoginDTO, AuthRegistrationDTO } from './dtos/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth/register' })
  async registration(@Payload() data: AuthRegistrationDTO) {
    const tokens = await this.authService.generateAndSaveTokens(data);

    return {
      ...data,
      ...tokens,
    };
  }

  @MessagePattern({ cmd: 'auth/authorization' })
  async authorization(@Payload() data: AuthLoginDTO) {
    const tokens = await this.authService.generateAndSaveTokens(data);

    return {
      ...data,
      ...tokens,
    };
  }

  @MessagePattern({ cmd: 'auth/refresh' })
  async refresh(@Payload() data: { refreshToken: string }) {
    const user = await this.authService.findUserByToken(data.refreshToken);
    const tokens = await this.authService.generateAndSaveTokens(user);

    return {
      ...tokens,
      ...user,
    };
  }
  @MessagePattern({ cmd: 'auth/logout' })
  async logout(@Payload() { refreshToken }: { refreshToken: string }) {
    return await this.authService.deleteToken(refreshToken);
  }
}
