import { PrismaService, DatabaseException } from '@lib';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import * as casbin from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import { Request } from 'express';
import { JwtPayload } from '../types';
import { checkIsPublic } from './jwt-auth/jwt-auth.guard';

/**
 * 这个guard要放在jwt鉴权之后执行，因为鉴权后可以拿到jwt token中的用户信息
 */
@Injectable()
export class CasbinAuthGuard implements CanActivate {
  private logger = new Logger(CasbinAuthGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (checkIsPublic(context, this.reflector)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const userPlayload = (request as any).user as JwtPayload;
    let currentRole;

    if (userPlayload.role) {
      currentRole = userPlayload.role;
    } else {
      const currentUser = await this.prismaService.user.findUnique({
        where: {
          id: userPlayload.sub,
        },
      });
      if (!currentUser) {
        throw new DatabaseException('用户不存在');
      }
      currentRole = currentUser.role;
    }

    const casbinModalPath = this.configService.get('CASBIN_MODAL_PATH');
    const a = await PrismaAdapter.newAdapter();
    const e = await casbin.newEnforcer(casbinModalPath, a);
    const canPass = await e.enforce(currentRole, request.url, request.method);
    return canPass;
  }
}
