import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExamService } from './exam.service';
import { MessagePattern } from '@nestjs/microservices';
import { ExamAddDto } from './dto/exam-add.dto';
import { UserInfo } from '@app/user/auth';
import { JwtPayload } from '@app/user/auth/types';

@Controller()
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  getHello(): string {
    return this.examService.getHello();
  }

  @MessagePattern('sum')
  sum(numArr: Array<number>): number {
    return numArr.reduce((total, item) => total + item, 0);
  }

  @Post('add')
  async add(@Body() dto: ExamAddDto, @UserInfo() userInfo: JwtPayload) {
    return this.examService.add(dto, userInfo.sub);
  }
}
