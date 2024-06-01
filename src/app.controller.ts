import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('superai')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/chat/:model')
  chat(@Query('query') query: string, @Param('model') model = 'llama3') {
    return this.appService.chat(query, model as any);
  }

  @Get('/chat-stream/:model')
  chatStream(
    @Query('query') query: string,
    @Param('model') model = 'llama3',
    @Res() res: Response,
  ) {
    return this.appService.chatStream(query, model as any, res);
  }
}
