import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FamilyCreationDto, FamilyDto, FamilyInfoDto } from './dto/familyDto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FamilyService {
  constructor(private readonly prisma: PrismaService) {}

  async createFamily(familyBody: FamilyCreationDto) {
    const data: Prisma.FamilyCreateInput = {
      name: familyBody.name,
    };

    if (familyBody.guardianId) {
      const guardian = await this.prisma.guardian.findUnique({
        where: { id: familyBody.guardianId },
      });
      if (!guardian) throw new NotFoundException('Guardian not found');
      data.guardians = {
        connect: { id: familyBody.guardianId },
      };
    }

    await this.prisma.family.create({ data });
  }

  async getFamilyById(familyId: string): Promise<FamilyDto> {
    const family = await this.prisma.family.findUnique({
      where: {
        id: familyId,
      },
      include: {
        childs: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        guardians: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!family) throw new NotFoundException('family not found');
    return family;
  }

  async getFamilies(): Promise<FamilyInfoDto[]> {
    return await this.prisma.family.findMany();
  }

  async isGuardianInFamily(
    guardianId: string,
    familyId: string,
  ): Promise<boolean> {
    const family = await this.prisma.family.findUnique({
      where: {
        id: familyId,
        guardians: {
          some: {
            id: guardianId,
          },
        },
      },
    });
    return !!family;
  }
}
