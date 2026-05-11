import { PrismaService } from './../prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  async sendAcceptedEmail(childId: string) {
    const text = `Bonjour,

Nous vous informons qu'une place a été libérée et que l'un de vos enfants a été accepté dans la file d'attente.

Vous disposez de 24 heures pour confirmer votre réponse.

Cordialement,
L'équipe des petits explorateurs`;

    const html = `
<p>Bonjour,</p>

<p>
  Nous vous informons qu'une place a été libérée et que l'un de vos enfants a été accepté dans la file d'attente.
</p>

<p>
  Vous disposez de <strong>24 heures</strong> pour confirmer votre réponse.
</p>

<p>Cordialement,<br>L'équipe des ptits explorateurs</p>
`;
    const guardians = await this.prisma.guardian.findMany({
      where: {
        families: {
          some: {
            childs: {
              some: {
                id: childId,
              },
            },
          },
        },
      },
    });
    for (const guardian of guardians) {
      const email = guardian.email;
      await this.mailerService.sendMail({
        to: email,
        subject: 'Place en file libérée',
        text,
        html,
      });
    }
  }
}
