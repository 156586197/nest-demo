import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
  Param,
} from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap {
  getHello(): string {
    return 'Hello World!';
  }

  onModuleInit(): any {
    console.log('init service');
  }
  onApplicationBootstrap(): any {
    console.log('boot service');
  }
}
