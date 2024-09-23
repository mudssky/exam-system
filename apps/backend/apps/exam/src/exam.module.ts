import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
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
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
