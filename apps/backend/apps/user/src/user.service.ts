import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'libs';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!';
  }
  @Inject(PrismaService)
  private prisma: PrismaService;
  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
      },
    });
  }
}
