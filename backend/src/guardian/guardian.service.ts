import { UserPayload } from './../auth/dto/payload';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  guardianDtoOpt,
  guardianInfoDto,
  registerGuardianCredentials,
} from './dto/guardianDto';
import { Response } from 'express';
import { hash } from 'bcrypt';
import { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GuardianService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getGuardian(guardianId: string): Promise<guardianInfoDto> {
    try {
      return await this.prisma.guardian.findFirstOrThrow({
        where: {
          id: guardianId,
        },
        omit: {
          password: true,
        },
        include: {
          families: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              name: true,
            },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      throw new NotFoundException();
    }
  }

  async getAllGuardians(): Promise<guardianInfoDto[]> {
    return await this.prisma.guardian.findMany({
      omit: {
        password: true,
      },
      include: {
        families: true,
      },
    });
  }

  async register(
    registerBody: registerGuardianCredentials,
    res: Response,
  ): Promise<void> {
    const hashedPassword = await this.hashPassword(registerBody.password);

    if (await this.findByEmail(registerBody.email)) {
      throw new ConflictException();
    }

    const user = await this.prisma.guardian.create({
      data: {
        email: registerBody.email,
        firstName: registerBody.firstName,
        lastName: registerBody.lastName,
        password: hashedPassword,
      },
    });

    const payLoad: UserPayload = { role: user.role, userId: user.id };
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

  private async findByEmail(email: string) {
    const [manager, guardian] = await Promise.all([
      this.prisma.manager.findUnique({ where: { email } }),
      this.prisma.guardian.findUnique({ where: { email } }),
    ]);

    return manager ?? guardian;
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

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async editGuardian(guardianId: string, data: guardianDtoOpt): Promise<void> {
    await this.prisma.guardian.update({
      where: {
        id: guardianId,
      },
      data,
    });
  }

  async deleteGuardian(guardianId: string): Promise<void> {
    await this.prisma.guardian.delete({
      where: {
        id: guardianId,
      },
    });
  }
}
