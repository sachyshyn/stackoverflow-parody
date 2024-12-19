import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresConfigService } from './config/database/postgres.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfigService } from './config/cache/redis.confg';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: PostgresConfigService,
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfigService,
      inject: [ConfigModule],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisConfigService],
})
export class AppModule {}
