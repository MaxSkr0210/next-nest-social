import {Controller, Get, Inject} from '@nestjs/common';
import { AppService } from './app.service';
import {ClientProxy} from "@nestjs/microservices";

@Controller()
export class AppController {
  constructor(
      @Inject('AUTH_SERVICE') private readonly taskServiceClient: ClientProxy,
  ) {}

  @Get('/auth/test')
  auth(){
    const a = this.taskServiceClient.emit('auth', 'test');
    console.log(a)
    return;
  }
}
