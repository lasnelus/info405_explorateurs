import { Module } from '@nestjs/common';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ChildController],
  providers: [ChildService, PrismaService],
})
export class ChildModule {}
