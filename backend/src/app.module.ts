import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GuardianModule } from './guardian/guardian.module';
import { FamilyModule } from './family/family.module';
import { ChildModule } from './child/child.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GuardianModule,
    FamilyModule,
    ChildModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
