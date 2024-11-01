import {
  PrismaService,
  PaginationDto,
  PaginationVo,
  parsePaginationDto,
  BaseException,
} from '@lib';
import { getRandomItemFromArray } from '@mudssky/jsutils';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { UserDtoType } from './types';
import NameDictionary from './nickNameDict.json';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private prismaService: PrismaService,
    // private readonly sharedService: SharedService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(paginationDto: PaginationDto) {
    const params = parsePaginationDto(paginationDto);
    const data = await this.prismaService.user.findMany({
      ...params,
    });
    const totalCount = await this.prismaService.user.count();
    const vo = new PaginationVo<(typeof data)[number]>();
    vo.results = data;
    vo.totalCount = totalCount;
    vo.pageNo = paginationDto.pageNo;
    vo.pageSize = paginationDto.pageSize;
    return vo;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prismaService.user.create({
      data,
    });

    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    const res = await this.prismaService.user.update({
      data,
      where,
    });
    return {
      ...res,
      // avatarFullUrl: this.sharedService.getFullImageUrl(res.avatarUrl ?? ''),
    };
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }
  /**
   * 登录时，可以输入用户名或邮箱作为登录的用户名
   * @param username
   */
  async findUserByNameOrEmail(
    username: string,
    // options?: {
    //   omitPassword?: boolean
    // },
  ) {
    // const { omitPassword = true } = options || {}
    return await this.prismaService.user.findMany({
      where: {
        OR: [
          {
            email: { equals: username },
          },
          {
            name: { equals: username },
          },
        ],
      },
      omit: {
        password: false,
      },
    });
  }
  async checkUserNameExists(name: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        name,
      },
    });
    if (user) {
      return true;
    }
    return false;
  }

  async findUserByGithubId(
    githubId: string,
  ): Promise<Partial<UserDtoType | null>> {
    const data = await this.prismaService.user.findUnique({
      where: {
        githubId: githubId,
      },
    });
    if (!data) {
      return null;
    }
    return data;
  }
  async getUserInfoById(id: string): Promise<Partial<UserDtoType>> {
    const data = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      omit: {
        githubAuthInfo: true,
      },
    });
    if (!data) {
      throw new BaseException('用户不存在');
    }
    return {
      ...data,
      // avatarFullUrl: this.sharedService.getFullImageUrl(data?.avatarUrl ?? ''),
    };
  }

  async generateNickName(): Promise<string> {
    if (
      NameDictionary.adjectives.length < 1 ||
      NameDictionary.nouns.length < 1
    ) {
      throw new BaseException('昵称词库不足');
    }
    const adjective = getRandomItemFromArray(NameDictionary.adjectives);
    const noun = getRandomItemFromArray(NameDictionary.nouns);
    return `${adjective}的${noun}`;
  }
}
