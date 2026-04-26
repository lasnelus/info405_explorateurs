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

<p>Cordialement,<br>L'équipe des petits explorateurs</p>
`;
    const child = await this.prisma.child.findUnique({
      where: { id: childId },
      include: {
        families: {
          include: {
            guardians: true,
          },
        },
      },
    });

    if (child) {
      const guardianIds: string[] = [];
      const seen: string[] = [];

      for (let i = 0; i < child.families.length; i++) {
        const family = child.families[i];

        for (let j = 0; j < family.guardians.length; j++) {
          const id = family.guardians[j].id;

          if (!seen.includes(id)) {
            seen.push(id);
            guardianIds.push(id);
          }
        }
      }
      for (const id of guardianIds) {
        await this.mailerService.sendMail({
          to: id,
          subject: 'Place en file libérée',
          text,
          html,
        });
      }
    }
  }
}
