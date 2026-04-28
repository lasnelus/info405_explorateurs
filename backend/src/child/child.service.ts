import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Child,
  EmergencyContact,
  Allergy,
  Prisma,
  FoodConstraint,
} from '@prisma/client';

@Injectable()
export class ChildService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllChild(): Promise<Child[]> {
    return this.prisma.child.findMany({
      include: {
        allergies: true,
        EmergencyContact: true,
        families: true,
        slots: true,
        queues: true,
      },
    });
  }

  async getChildById(@Param('id') id: string): Promise<Child | null> {
    return this.prisma.child.findUnique({
      where: { id },
      include: {
        allergies: true,
        EmergencyContact: true,
        families: true,
        slots: true,
        queues: true,
      },
    });
  }

  async addChild(data: {
    firstName: string;
    lastName: string;
    birthDate: Date;
    foodConstraint?: FoodConstraint;
    familyIds?: string[];
  }): Promise<Child> {
    // Utilisation de l'enum FoodConstraint pour éviter unsafe assignment
    const childData: Prisma.ChildCreateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      foodConstraint: data.foodConstraint ?? FoodConstraint.NONE,
    };

    if (data.familyIds?.length) {
      childData.families = { connect: data.familyIds.map((id) => ({ id })) };
    }

    return this.prisma.child.create({
      data: childData,
      include: { families: true },
    });
  }

  async deleteChild(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.prisma.child.delete({ where: { id } });
      return { message: `Child with id ${id} deleted successfully.` };
    } catch {
      throw new Error(`Child with id ${id} not found`);
    }
  }

  async addEmergencyContact(
    childId: string,
    contact: { firstName: string; lastName: string; phoneNumber: string },
  ): Promise<EmergencyContact> {
    // Typage explicite pour éviter unsafe call / unsafe member access
    return await this.prisma.emergencyContact.create({
      data: {
        childId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
      },
    });
  }

  async addAllergy(childId: string, allergy: string): Promise<Allergy> {
    allergy = allergy.toLowerCase().trim();

    await this.prisma.child.findUniqueOrThrow({
      where: { id: childId },
    });

    return await this.prisma.allergy.create({
      data: {
        childId,
        allergy,
      },
    });
  }

  async addChildToFamily(childId: string, familyId: string): Promise<Child> {
    return this.prisma.child.update({
      where: { id: childId },
      data: { families: { connect: { id: familyId } } },
      include: { families: true },
    });
  }
}
