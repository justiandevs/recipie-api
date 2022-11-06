import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findOneByUsername(
      createUserDto.name,
    );

    if (userExists) throw new BadRequestException('User already exists');

    const hash = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });

    const tokens = await this.getTokens(newUser.id!, newUser.name);
    await this.updateRefreshToken(newUser.id!, tokens.refreshToken);
    return tokens;
  }

  async signIn(authDto: AuthDto) {
    const user = await this.usersService.findOneByUsername(authDto.name);
    if (user === null) throw new BadRequestException('User does not exist');
    const passwordMatches = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Credentials are invalid');
    const tokens = await this.getTokens(user.id!, user.name);
    await this.updateRefreshToken(user.id!, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: '' });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.usersService.update(userId, { refreshToken: refreshToken });
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (user === null || user.refreshToken === '')
      throw new ForbiddenException('Access Denied');
    if (refreshToken != user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id!, user.name);
    await this.updateRefreshToken(user.id!, tokens.refreshToken);
    return tokens;
  }
}
