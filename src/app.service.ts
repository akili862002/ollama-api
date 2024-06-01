import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as nanoid from 'nanoid';
import ollama, { Message } from 'ollama';
import { Logger } from 'winston';
import { createLogger } from './utils/logs.util';

@Injectable()
export class AppService {
  logger: Logger;
  constructor() {
    this.logger = createLogger({ name: 'chat-service' });
  }

  async chat(message: string, model: 'llama3' | 'phi3') {
    try {
      const id = nanoid.nanoid();
      const start = Date.now();
      console.log('------------------------------');
      console.log(`[${id}] ${dayjs().format('DD MMM YYYY - HH:mm:ss')}`);
      console.log(`[${id}] Message: '${message}' (model: ${model})`);

      this.logger.info(`[${id}] Message: '${message}' (model: ${model})`);

      const messageItem: Message = {
        role: 'user',
        content: message,
      };
      const response = await ollama.chat({
        model,
        messages: [messageItem],
      });
      // for await (const part of response) {
      //   process.stdout.write(part.message.content);
      // }

      console.log(`[${id}] Answer: '${response.message.content}'`);
      console.log(
        `[${id}] Ended. Duration: '${response.message.content}' - ${Date.now() - start}ms`,
      );
      console.log('------------------------------');

      this.logger.info(`[${id}] Answer: '${response.message.content}'`);

      return {
        answer: response.message.content,
      };
    } catch (error) {
      console.error(error);
      this.logger.error(error);

      return {
        error: error.message,
      };
    }
  }
}
