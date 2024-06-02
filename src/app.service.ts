import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as nanoid from 'nanoid';
import ollama, { Message } from 'ollama';
import { Logger } from 'winston';
import { createLogger } from './utils/logs.util';
import { Response } from 'express';

const messages: Message[] = [
  {
    role: 'user',
    content: 'You are my A.I. Your name is Super.AI. Created by Surtin.',
  },
  {
    role: 'user',
    content: `Data: today is ${dayjs().format('DD MMM YYYY, HH:mm:ss')}. The temperature is 35°C in Ho Chi Minh City, VietNam. It's a sunny day.`,
  },
];

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

      const newMessage: Message = {
        role: 'user',
        content: `Answer my question as a 14 years old child. Short, simple, and easy to understand. \n${message}`,
      };
      const response = await ollama.chat({
        model,
        messages: [...messages, newMessage],
      });
      // for await (const part of response) {
      //   process.stdout.write(part.message.content);
      // }

      console.log(`[${id}] Answer: '${response.message.content}'`);
      console.log(`[${id}] Ended. Duration: ${Date.now() - start}ms`);
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

  async chatStream(message: string, model: 'llama3' | 'phi3', res: Response) {
    try {
      const id = nanoid.nanoid();
      const start = Date.now();
      console.log('------------------------------');
      console.log(`[${id}] ${dayjs().format('DD MMM YYYY - HH:mm:ss')}`);
      console.log(`[${id}] Message: '${message}' (model: ${model})`);

      this.logger.info(`[${id}] Message: '${message}' (model: ${model})`);

      const newMessage: Message = {
        role: 'user',
        content: message,
      };
      const response = await ollama.chat({
        model,
        messages: [...messages, newMessage],
        stream: true,
      });

      let answer = '';
      for await (const part of response) {
        res.write(part.message.content);
        answer += part.message.content;
      }
      res.end();

      console.log(`[${id}] Ended. Duration: ${Date.now() - start}ms`);
      console.log('------------------------------');

      this.logger.info(`[${id}] Answer: '${answer}'`);
    } catch (error) {
      console.error(error);
      this.logger.error(error);

      return {
        error: error.message,
      };
    }
  }
}
