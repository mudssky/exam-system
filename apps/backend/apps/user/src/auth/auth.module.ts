import { SECOND } from '@libs/common/constant';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth/ws-jwt-auth.guard';
import { GithubStrategy } from './strategy/github.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { EmailModule, EnvironmentVariables } from '@lib';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = {
          secret: configService.get<string>('JWT_SECRET') ?? 'secret',
          signOptions: {
            expiresIn:
              (configService.get<number>('JWT_EXPIRATION') ?? 0) * SECOND,
          },
        };
        return config;
      },
      inject: [ConfigService], // 注入 ConfigService
    }),
    EmailModule.forRootAsync({
      isGlobal: true,
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => {
        return {
          smtpOptions: {
            // host: configService.get('MAIL_HOST'),
            // port: configService.get('MAIL_PORT'),
            // secure: false,
            service: configService.get('MAIL_SERVICE_NAME'),
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASS'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GithubStrategy,
    GoogleStrategy,
    WsJwtAuthGuard,
  ],
  exports: [AuthService, WsJwtAuthGuard, JwtModule],
})
export class AuthModule {}
