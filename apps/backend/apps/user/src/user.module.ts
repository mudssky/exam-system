import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getEnvConfig, PrismaModule, RedisModule, validate } from 'libs';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRoot({
      redisOptions: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env.production.local', '.env.production', '.env']
          : ['.env.development.local', '.env.development'],
      isGlobal: true,
      load: [getEnvConfig],
      cache: true, //缓存，提升访问.env的性能
      validate,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserMainModule {}
