import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GuardianModule } from './guardian/guardian.module';
import { FamilyModule } from './family/family.module';
import { ChildModule } from './child/child.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GuardianModule,
    FamilyModule,
    ChildModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
