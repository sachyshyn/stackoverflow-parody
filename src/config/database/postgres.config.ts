import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  get #host() {
    return this.configService.get<string>('DATABASE_HOST') ?? 'localhost';
  }

  get #port() {
    return Number(this.configService.get<string>('DATABASE_PORT')) ?? 3000;
  }

  get #username() {
    return this.configService.get<string>('DATABASE_USER');
  }

  get #password() {
    return this.configService.get<string>('DATABASE_PASSWORD');
  }

  get #database() {
    return this.configService.get<string>('DATABASE_NAME');
  }

  get #shallSynchronize() {
    return this.configService.get<string>('NODE_ENV') !== 'production';
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.#host,
      port: this.#port,
      username: this.#username,
      password: this.#password,
      database: this.#database,
      entities: [],
      synchronize: this.#shallSynchronize,
    };
  }
}
