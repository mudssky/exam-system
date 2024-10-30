import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { RedisModule } from 'libs';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from '@app/user/auth/guards';
import { GlobalValidationPipe } from '@libs/common/pipes/global-validation/global-validation.pipe';

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
  providers: [
    ExamService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
  ],
})
export class ExamModule {}
