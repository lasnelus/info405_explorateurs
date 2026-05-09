import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FamilyCreationDto,
  FamilyDto,
  FamilyDtoOpt,
  FamilyInfoDto,
} from './dto/familyDto';
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

  async deleteFamily(familyId: string): Promise<void> {
    await this.prisma.family.delete({
      where: {
        id: familyId,
      },
    });
  }

  async editFamily(
    familyId: string,
    data: FamilyDtoOpt,
  ): Promise<FamilyInfoDto> {
    return await this.prisma.family.update({
      where: {
        id: familyId,
      },
      data,
    });
  }

  async getChild(childId: string) {
    return await this.prisma.child.findUnique({
      where: {
        id: childId,
      },
    });
  }

  async getGuardian(guardianId: string) {
    return await this.prisma.guardian.findUnique({
      where: {
        id: guardianId,
      },
    });
  }

  async connectChild(familyId: string, childId: string) {
    await this.prisma.child.update({
      where: {
        id: childId,
      },
      data: {
        families: {
          connect: {
            id: familyId,
          },
        },
      },
    });
  }

  async disconnectChild(familyId: string, childId: string) {
    await this.prisma.child.update({
      where: {
        id: childId,
      },
      data: {
        families: {
          disconnect: {
            id: familyId,
          },
        },
      },
    });
  }

  async connectGuardian(familyId: string, guardianId: string) {
    await this.prisma.guardian.update({
      where: {
        id: guardianId,
      },
      data: {
        families: {
          connect: {
            id: familyId,
          },
        },
      },
    });
  }

  async disconnectGuardian(familyId: string, guardianId: string) {
    await this.prisma.guardian.update({
      where: {
        id: guardianId,
      },
      data: {
        families: {
          disconnect: {
            id: familyId,
          },
        },
      },
    });
  }
}
