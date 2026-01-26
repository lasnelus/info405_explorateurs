import { Injectable, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChildService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllChild() {
    return this.prisma.child.findMany();
  }

  async getChildById(@Param('id') id: string) {
    return this.prisma.child.findUnique({
      where: {
        id: id,
      },
    });
  }

  async addChild(data: { firstName: string; lastName: string }) {
    const child = await this.prisma.child.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
    return { data: child };
  }

  async deleteChild(@Param('id') id: string) {
    try {
      await this.prisma.child.delete({
        where: { id: id },
      });
      return { message: `Child with id ${id} deleted successfully.` };
    } catch {
      throw new Error(`Child with id ${id} not found`);
    }
  }
}
