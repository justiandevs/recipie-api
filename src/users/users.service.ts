import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOneOrFail({ where: { id: id } });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneOrFail({
      where: { name: username },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, {
      ...updateUserDto,
    });
  }

  remove(id: number) {
    // TODO: Make remove action
  }
}
