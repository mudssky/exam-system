import { Inject, Injectable } from '@nestjs/common';
import { ExamAddDto } from './dto/exam-add.dto';
import { PrismaService } from '@lib';

@Injectable()
export class ExamService {
  getHello(): string {
    return 'Hello World!';
  }

  @Inject(PrismaService)
  private prismaService: PrismaService;

  async add(dto: ExamAddDto, userId: string) {
    return this.prismaService.exam.create({
      data: {
        name: dto.name,
        content: '',
        createUser: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}
