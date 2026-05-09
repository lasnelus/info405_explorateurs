import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import {
  ManagerDtoOpt,
  ManagerInfoDto,
  registerManagerCredentials,
} from './dto/managerDto';
import { hash } from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class ManagerService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  private async findByEmail(email: string) {
    const [manager, guardian] = await Promise.all([
      this.prisma.manager.findUnique({ where: { email } }),
      this.prisma.guardian.findUnique({ where: { email } }),
    ]);

    return manager ?? guardian;
  }

  async register(registerBody: registerManagerCredentials): Promise<void> {
    const hashedPassword = await this.hashPassword(registerBody.password);
    const role = registerBody.role === 'OWNER' ? Role.OWNER : Role.INSTRUCTOR;
    if (await this.findByEmail(registerBody.email)) {
      throw new ConflictException();
    }

    await this.prisma.manager.create({
      data: {
        email: registerBody.email,
        firstName: registerBody.firstName,
        lastName: registerBody.lastName,
        password: hashedPassword,
        role: role,
      },
    });
  }

  async getManagers(): Promise<ManagerInfoDto[]> {
    return await this.prisma.manager.findMany({
      omit: {
        password: true,
      },
    });
  }

  async getManagerById(managerId: string): Promise<ManagerInfoDto | null> {
    return await this.prisma.manager.findUnique({
      where: {
        id: managerId,
      },
      omit: {
        password: true,
      },
    });
  }

  async deleteManagerById(managerId: string): Promise<void> {
    await this.prisma.manager.delete({
      where: {
        id: managerId,
      },
    });
  }

  async editMangerById(
    managerId: string,
    data: ManagerDtoOpt,
  ): Promise<ManagerInfoDto> {
    if (data.password) data.password = await this.hashPassword(data.password);
    const role = data.role === 'OWNER' ? Role.OWNER : Role.INSTRUCTOR;
    return await this.prisma.manager.update({
      where: {
        id: managerId,
      },
      data: {
        id: data.id,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role,
      },
      omit: {
        password: true,
      },
    });
  }
}
