import { Injectable } from '@nestjs/common';
import ollama, { Message } from 'ollama';

@Injectable()
export class AppService {
  constructor() {}

  async chat(message: string, model: 'llama3' | 'phi3') {
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

    return {
      answer: response.message.content,
    };
  }
}
