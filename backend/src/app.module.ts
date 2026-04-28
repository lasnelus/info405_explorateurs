import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GuardianModule } from './guardian/guardian.module';
import { FamilyModule } from './family/family.module';
import { ChildModule } from './child/child.module';
import { AuthModule } from './auth/auth.module';
import { PeriodeModule } from './periode/periode.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

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
    PeriodeModule,
    MailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
