import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  get #host() {
    return this.configService.getOrThrow<string>('DATABASE_HOST');
  }

  get #port() {
    return Number(this.configService.getOrThrow<string>('DATABASE_PORT'));
  }

  get #username() {
    return this.configService.getOrThrow<string>('DATABASE_USER');
  }

  get #password() {
    return this.configService.getOrThrow<string>('DATABASE_PASSWORD');
  }

  get #database() {
    return this.configService.getOrThrow<string>('DATABASE_NAME');
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
      synchronize: false,
      autoLoadEntities: true,
    };
  }
}
