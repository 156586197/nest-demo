import {
  BeforeApplicationShutdown,
  Module,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit
} from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AaaModule } from './aaa/aaa.module';

@Module({
  imports: [AaaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown
{
  onModuleInit(): any {
    console.log('init');
  }
  onApplicationBootstrap(): any {
    console.log('boot');
  }
  onModuleDestroy(): any {
    console.log('destroy Module');
  }
  beforeApplicationShutdown(signal?: string): any {
    console.log('shutdown Module');
  }
}
