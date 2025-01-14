import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_ENTITIES } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature(USER_ENTITIES)],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
