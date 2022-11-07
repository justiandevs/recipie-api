import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class UsersService {
  private readonly redis: Redis;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { name: username },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, {
      ...updateUserDto,
    });
  }

  async updateRefreshToken(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto.refreshToken);

    await this.redis.set(
      `${id}`,
      `${updateUserDto.refreshToken}`,
      'EX',
      '604800',
    );
  }

  async getRefreshToken(id: number) {
    return await this.redis.get(`${id}`);
  }

  async remove(id: number) {
    return await this.usersRepository.delete({ id });
  }
}
