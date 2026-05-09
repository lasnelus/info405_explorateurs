import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { registerManagerCredentials } from './dto/managerDto';
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
}
