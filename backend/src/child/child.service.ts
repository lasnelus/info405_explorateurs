import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, FoodConstraint } from '@prisma/client';

@Injectable()
export class ChildService {
  constructor(private readonly prisma: PrismaService) {}

  private childInclude = {
    allergies: true,
    EmergencyContact: true,
    families: true,
    slots: true,
    queues: true,
  };

  private childSelect = {
    id: true,
    firstName: true,
    lastName: true,
    birthDate: true,
    foodConstraint: true,
    createdAt: true,
    updatedAt: true,

    allergies: {
      select: {
        id: true,
        allergy: true,
      },
    },

    EmergencyContact: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
      },
    },

    families: true,
    slots: true,
    queues: true,
  };

  getAllChild() {
    return this.prisma.child.findMany({
      select: this.childSelect,
    });
  }

  getChildById(id: string) {
    return this.prisma.child.findUnique({
      where: { id },
      select: this.childSelect,
    });
  }

  addChild(data: {
    firstName: string;
    lastName: string;
    birthDate: Date;
    foodConstraint?: FoodConstraint;
    familyIds?: string[];
  }) {
    const childData: Prisma.ChildCreateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      foodConstraint: data.foodConstraint ?? FoodConstraint.NONE,
    };

    if (data.familyIds?.length) {
      childData.families = {
        connect: data.familyIds.map((id) => ({ id })),
      };
    }

    return this.prisma.child.create({
      data: childData,
      include: this.childInclude,
    });
  }

  deleteChild(id: string) {
    return this.prisma.child
      .delete({ where: { id } })
      .then(() => ({
        message: `Child with id ${id} deleted successfully.`,
      }))
      .catch(() => {
        throw new Error(`Child with id ${id} not found`);
      });
  }

  addEmergencyContact(
    childId: string,
    contact: { firstName: string; lastName: string; phoneNumber: string },
  ) {
    return this.prisma.emergencyContact.create({
      data: {
        childId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber,
      },
    });
  }

  addAllergy(childId: string, allergy: string) {
    return this.prisma.allergy.create({
      data: {
        childId,
        allergy: allergy.toLowerCase().trim(),
      },
    });
  }

  async deleteEmergencyContact(childId: string, contactId: string) {
    await this.prisma.emergencyContact.delete({
      where: {
        id: contactId,
      },
    });

    return {
      message: `Emergency contact ${contactId} deleted for child ${childId}`,
    };
  }

  async deleteAllergy(childId: string, allergyId: string) {
    await this.prisma.allergy.delete({
      where: {
        id: allergyId,
      },
    });

    return {
      message: `Allergy ${allergyId} deleted for child ${childId}`,
    };
  }
}
