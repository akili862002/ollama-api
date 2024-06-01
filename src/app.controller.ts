import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('superai')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/chat/:model')
  chat(@Query('query') query: string, @Param('model') model = 'llama3') {
    return this.appService.chat(query, model as any);
  }
}
