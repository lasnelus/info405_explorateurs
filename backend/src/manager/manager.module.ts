import { PrismaModule } from './../prisma/prisma.module';
import {
  ConflictException,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { registerManagerCredentials } from './dto/managerDto';

@Module({
  imports: [PrismaModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule implements OnModuleInit {
  private readonly logger = new Logger(ManagerModule.name);

  constructor(private readonly managerService: ManagerService) {}

  async onModuleInit() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const firstName = process.env.ADMIN_FIRSTNAME;
    const lastName = process.env.ADMIN_LASTNAME;
    if (email && password && firstName && lastName) {
      const registerBody: registerManagerCredentials = {
        email,
        password,
        firstName,
        lastName,
        role: 'OWNER',
      };
      try {
        await this.managerService.register(registerBody);
        this.logger.log('Administrateur par défaut créé');
      } catch (err) {
        if (err instanceof ConflictException) {
          this.logger.log('Administrateur par défaut disponible');
        } else {
          this.logger.warn(
            "Echecs lors de la création de l'administrateur par défaut",
          );
          this.logger.warn(err);
        }
      }
    }
  }
}
