import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CredentialsDto } from './dto/credentials.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { UserPayload } from './dto/payload';
import { StringValue } from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async login(authBody: CredentialsDto, res: Response): Promise<void> {
    const { email, password } = authBody;

    const user = await this.findByEmail(email);
    if (!user || !(await this.isPasswordValid(password, user.password)))
      throw new UnauthorizedException();

    const role: Role = user.role;
    const userId: string = user.id;

    const payLoad: UserPayload = { role, userId };
    const refreshToken = this.getRefreshToken(payLoad);

    this.putRefreshTokenCookies(res, refreshToken);
  }

  private putRefreshTokenCookies(res: Response, refreshToken: string): void {
    res.cookie(
      process.env.REFRESHTOKEN_COOKIE_NAME || 'refresh_token',
      refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:
          1000 *
          (parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '604800', 10) ||
            604800), // 1 jour en millisecondes
        path: '/',
      },
    );
  }

  private getRefreshToken(payLoad: UserPayload): string {
    let expiration: StringValue = '7d' as StringValue;
    if (process.env.REFRESH_TOKEN_EXPIRES_IN) {
      expiration = (process.env.REFRESH_TOKEN_EXPIRES_IN + 's') as StringValue;
    }
    return this.jwtService.sign(payLoad, {
      secret: process.env.REFRESHTOKEN_SECRET,
      expiresIn: expiration,
    });
  }

  getAccessToken(payLoad: UserPayload): string {
    let expiration: StringValue = '15m' as StringValue;
    if (process.env.REFRESH_TOKEN_EXPIRES_IN) {
      expiration = (process.env.ACCESS_TOKEN_EXPIRES_IN + 's') as StringValue;
    }
    return this.jwtService.sign(payLoad, {
      secret: process.env.ACCESSTOKEN_SECRET,
      expiresIn: expiration,
    });
  }

  private async findByEmail(email: string) {
    const [manager, guardian] = await Promise.all([
      this.prisma.manager.findUnique({ where: { email } }),
      this.prisma.guardian.findUnique({ where: { email } }),
    ]);

    return manager ?? guardian;
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
