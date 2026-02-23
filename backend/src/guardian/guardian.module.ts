import { Module } from '@nestjs/common';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule],
  controllers: [GuardianController],
  providers: [GuardianService, JwtService],
})
export class GuardianModule {}
