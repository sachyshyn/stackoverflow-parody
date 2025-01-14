import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);

    const savedUser = await this.usersRepository.save(user);

    delete savedUser.email;

    return savedUser;
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(uuid: number) {
    return this.usersRepository.findOneBy({ uuid });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
