import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { refreshTokenStrategy } from './refreshToken.strategy';
import { accessTokenStrategy } from './accessToken.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    refreshTokenStrategy,
    accessTokenStrategy,
  ],
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
})
export class AuthModule {}
