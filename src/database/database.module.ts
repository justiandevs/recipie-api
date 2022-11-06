import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(<string>configService.get<string>('DATABASE_PORT')),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASS'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
