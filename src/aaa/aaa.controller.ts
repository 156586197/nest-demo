import {
  BeforeApplicationShutdown,
  Body,
  Controller,
  Delete,
  Get,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit,
  Param,
  Patch,
  Post,
  Query,
  Sse,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { Observable } from 'rxjs';
import { AaaException } from '../AaaException';
import { AaaFilter } from '../aaa.filter';
import { AaaGuard } from '../aaa.guard';
import { Roles } from '../roles.decorator';
import { Role } from '../role';

/**
 * 所有钩子都是允许异步实现
 * OnModuleInit 初始化生命周期， 可以初始化数据库链接
 * OnApplicationBootstrap
 * OnModuleDestroy 和BeforeApplicationShutdown的不同之处在于，BeforeApplicationShutdown可以拿到singal系统信号
 * BeforeApplicationShutdown
 */
@Controller('aaa')
export class AaaController
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown
{
  constructor(private readonly aaaService: AaaService) {}

  async onModuleInit(): Promise<any> {
    await new Promise((resolve) => {
      resolve(123);
    });
    console.log('init con');
  }

  onApplicationBootstrap(): any {
    console.log('boot con');
  }

  onModuleDestroy(): any {
    console.log('destroy con');
  }
  beforeApplicationShutdown(signal?: string): any {
    console.log('shutdown con');
  }

  @Get()
  @UseFilters(AaaFilter)
  @UseGuards(AaaGuard)
  @Roles(Role.Admin)
  getHello(): string {
    throw new AaaException('aaa', 'bbb');
  }

  @Post('file')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: 'uploads/',
    }),
  )
  body2(
    @Body() createAaaDto: CreateAaaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(createAaaDto, files);
    return `received: ${JSON.stringify(createAaaDto)}`;
  }

  @Sse('stream')
  stream() {
    return new Observable((observer) => {
      observer.next({ data: { msg: 'aaa' } });
      setTimeout(() => {
        observer.next({ data: { msg: 'bbb' } });
      }, 3000);
      setTimeout(() => {
        observer.next({ data: { msg: 'ccc' } });
      }, 5000);
    });
  }

  @Post()
  create(@Body() createAaaDto: CreateAaaDto) {
    return this.aaaService.create(createAaaDto);
  }

  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return `recived: name=${name} age=${age}`;
  }

  @Get()
  findAll() {
    return this.aaaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aaaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(+id, updateAaaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aaaService.remove(+id);
  }
}
