import {
  ConflictException,
  Injectable,
  UnauthorizedException,
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

  login = async (userDto: CreateUserDto) => {
    const existingUser = await this.usersService.findOneByEmail(userDto.email);

    if (!existingUser) {
      throw new UnauthorizedException('User with this email not found');
    }

    if (!argon.verify(existingUser.password, userDto.password)) {
      throw new UnauthorizedException('Email or password does not match');
    }

    return this.signToken(existingUser.uuid, userDto.email);
  };

  logout() {
    return 'logout';
  }
}
