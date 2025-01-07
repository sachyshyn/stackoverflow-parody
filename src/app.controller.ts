import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly appService: AppService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const cached = await this.redis.get('key');
    if (cached) {
      return `cached: ${cached}`;
    }

    const current = this.appService.getHello();
    await this.redis.set('key', current);

    return current;
  }
}
