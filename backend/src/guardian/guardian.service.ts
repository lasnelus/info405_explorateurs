import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { guardianInfoDto } from './dto/guardianDto';

@Injectable()
export class GuardianService {
  constructor(private readonly prisma: PrismaService) {}

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
          families: true,
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
}
