import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from 'libs';

@Module({
  imports: [
    RedisModule.forRoot({
      redisOptions: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
