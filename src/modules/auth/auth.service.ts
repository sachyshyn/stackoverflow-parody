import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await argon.hash(createUserDto.password);

    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // TODO: add token caching

    return this.signToken(createdUser.uuid, createdUser.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.configService.get('JWT_SECRET');

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token };
  }

  async login(userDto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(userDto.email);

    if (!existingUser) {
      return new BadRequestException('Incorrect email or password');
    }

    const passwordsMatched = await argon.verify(
      existingUser.password,
      userDto.password,
    );

    if (!passwordsMatched) {
      return new BadRequestException('Incorrect email or password');
    }

    return this.signToken(existingUser.uuid, existingUser.email);
  }

  logout() {
    return 'logout';
  }
}
