import { Module } from '@nestjs/common';
import { PeriodeController } from './periode.controller';
import { PeriodeService } from './periode.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PeriodeController],
  providers: [PeriodeService],
  imports: [PrismaModule],
})
export class PeriodeModule {}
