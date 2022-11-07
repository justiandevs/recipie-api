import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(<string>configService.get<string>('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class RedisCacheModule {}
