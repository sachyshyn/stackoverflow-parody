import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  get #host() {
    return this.configService.get<string>('REDIS_HOST', 'redis');
  }

  get #port() {
    return this.configService.get<string>('REDIS_PORT', '6379');
  }

  createRedisModuleOptions(): RedisModuleOptions {
    return {
      type: 'single',
      url: `redis://${this.#host}:${this.#port}`,
    };
  }
}
