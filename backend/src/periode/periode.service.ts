import { MailService } from './../mail/mail.service';
import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePeriodeDto,
  PeriodeDtoOpt,
  PeriodeInfoDto,
} from './dto/periodeDto';
import { attendanceDto, SlotInfoDto } from './dto/slotDto';
import {
  RegisterInfoDto,
  stateRegisterPeriode,
} from './dto/registerPeriodeDto';
import { QueueInfoDto } from './dto/queueDto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PeriodeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateQueue() {
    console.log('UPDATE QUEUE');
    const nowPlusOneDay = new Date(Date.now());
    nowPlusOneDay.setDate(nowPlusOneDay.getDate() - 1);

    await this.prisma.queue.updateMany({
      where: {
        acceptedAt: {
          lte: nowPlusOneDay,
        },
      },
      data: {
        state: 'TIMEOUT',
      },
    });

    const now = new Date();
    const periodesToUpdate = await this.prisma.periode.findMany({
      where: {
        lastDay: {
          gte: now,
        },
      },
    });
    for (const periode of periodesToUpdate) {
      const daysOfPeriode = this.extractDateFromCompleteDate(
        new Date(periode.firstDay),
      );
      while (daysOfPeriode <= periode.lastDay) {
        await this.updateDayInPeriode(periode.id, daysOfPeriode);
        daysOfPeriode.setDate(daysOfPeriode.getDate() + 1);
      }
    }
  }

  async updateDayInPeriode(periodeId: string, day: Date) {
    if (periodeId != 'cmp0e5jyc00008njmh3960b9i') return;
    const capacity = (await this.getPeriodesById(periodeId))!.capacity;
    console.log('day', day);
    const slots = await this.countSlots(periodeId, day);
    const queueAccepted = await this.countQueuesAccepted(periodeId, day);
    const toUpdate: number = Math.max(0, capacity - slots - queueAccepted);
    console.log(`id: ${periodeId}`);
    console.log('coucou');
    console.log(
      `capacity : ${capacity}, slots: ${slots}, accepted: ${queueAccepted}  toUpdate: ${toUpdate}`,
    );
    // d'abord on récup toute les queues avec leurs familles pour voir si d'autre membre de leur familles sont inscrits se jour la
    const pendingQueues = await this.prisma.queue.findMany({
      where: {
        periodeId,
        day,
        state: 'PENDING',
      },
      include: {
        child: {
          include: {
            families: {
              include: {
                childs: {
                  include: {
                    slots: {
                      where: { periodeId, day },
                      select: { id: true },
                    },
                    queues: {
                      where: { periodeId, day, state: 'ACCEPTED' },
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculer le nombre de membre de la même famille déjà inscrits pour chaque demande
    const queuesWithPriority = pendingQueues.map((queue) => {
      let memberAlreadyInSlot = 0;
      const familyMemberFind = new Set();

      queue.child.families.forEach((family) => {
        family.childs.forEach((sibling) => {
          // On s'assure de ne pas compter l'enfant lui même ou  de compter un enfant deux fois
          if (
            sibling.id !== queue.child.id &&
            !familyMemberFind.has(sibling.id)
          ) {
            familyMemberFind.add(sibling.id);

            // Un membre de la famille est déjà s'il a un Slot ou si sa Queue est ACCEPTED
            const isChildOk =
              sibling.slots.length > 0 || sibling.queues.length > 0;
            if (isChildOk) {
              memberAlreadyInSlot++;
            }
          }
        });
      });

      return {
        ...queue,
        memberAlreadyInSlot,
      };
    });

    // trie les demandes par ordre de prio
    let remainingItems = queuesWithPriority.length;
    let isSorted: boolean;

    do {
      isSorted = true;

      for (let i = 0; i < remainingItems - 1; i++) {
        const current = queuesWithPriority[i];
        const next = queuesWithPriority[i + 1];
        let requiresSwap = false;

        // d'abord par les gens de la même famille déjà inscrits
        if (current.memberAlreadyInSlot < next.memberAlreadyInSlot) {
          requiresSwap = true;
        }
        // puis par date d'inscription
        else if (current.memberAlreadyInSlot === next.memberAlreadyInSlot) {
          if (current.createdAt.getTime() > next.createdAt.getTime()) {
            requiresSwap = true;
          }
        }

        // echange des elements sans passer par une variable temporaire
        if (requiresSwap) {
          [queuesWithPriority[i], queuesWithPriority[i + 1]] = [
            queuesWithPriority[i + 1],
            queuesWithPriority[i],
          ];
          isSorted = false;
        }
      }
      remainingItems--;
    } while (!isSorted);

    // on fini la liste avec que les queue a accetper
    const queueToAccept = queuesWithPriority.slice(0, toUpdate);

    // et maintenant on accepte des gens
    for (const queue of queueToAccept) {
      await this.prisma.queue.update({
        where: { id: queue.id },
        data: {
          state: 'ACCEPTED',
          acceptedAt: new Date(Date.now()),
        },
      });
      await this.mailService.sendAcceptedEmail(queue.childId);
    }
  }

  async countSlots(periodeId: string, day: Date): Promise<number> {
    return await this.prisma.slot.count({
      where: {
        periodeId,
        day,
      },
    });
  }

  async countQueuesAccepted(periodeId: string, day: Date): Promise<number> {
    return await this.prisma.queue.count({
      where: {
        periodeId,
        day,
        state: 'ACCEPTED',
      },
    });
  }

  async getPeriodes() {
    return await this.prisma.periode.findMany();
  }

  async getPeriodesById(perdiodeId: string): Promise<PeriodeInfoDto | null> {
    return await this.prisma.periode.findUnique({
      where: {
        id: perdiodeId,
      },
    });
  }

  async editPeriodesById(
    perdiodeId: string,
    data: PeriodeDtoOpt,
  ): Promise<PeriodeInfoDto | null> {
    if (data.firstDay)
      data.firstDay = this.extractDateFromCompleteDate(
        new Date(data.firstDay),
      ).toISOString();
    if (data.lastDay)
      data.lastDay = this.extractDateFromCompleteDate(
        new Date(data.lastDay),
      ).toISOString();
    return await this.prisma.periode.update({
      where: {
        id: perdiodeId,
      },
      data,
    });
  }

  async deletePeriode(perdiodeId: string) {
    await this.prisma.periode.delete({
      where: {
        id: perdiodeId,
      },
    });
  }

  async createPeriodes(creationBody: CreatePeriodeDto) {
    if (creationBody.firstDay)
      creationBody.firstDay = this.extractDateFromCompleteDate(
        new Date(creationBody.firstDay),
      ).toISOString();
    if (creationBody.lastDay)
      creationBody.lastDay = this.extractDateFromCompleteDate(
        new Date(creationBody.lastDay),
      ).toISOString();
    await this.prisma.periode.create({
      data: creationBody,
    });
  }

  async getSlotsByPeriodeAndDay(
    periodeId: string,
    date: Date,
  ): Promise<SlotInfoDto[]> {
    return await this.prisma.slot.findMany({
      where: {
        periodeId,
        day: date,
      },
      select: {
        id: true,
        isChildPresent: true,
        child: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
        day: true,
        periodeId: true,
      },
    });
  }

  private extractDateFromCompleteDate(rawDate: Date): Date {
    return new Date(
      rawDate.getFullYear() +
        '-' +
        (rawDate.getMonth() + 1) +
        '-' +
        rawDate.getDate(),
    );
  }

  async registerInPeriode(
    periodeId: string,
    childId: string,
    dateIso: string,
  ): Promise<RegisterInfoDto> {
    const date = this.extractDateFromCompleteDate(new Date(dateIso));
    const periode = await this.getPeriodesById(periodeId);
    if (!periode || date < periode.firstDay || date > periode.lastDay)
      throw new BadRequestException();
    const slots = await this.getSlotsByPeriodeAndDay(periodeId, date);
    const isChildInQueue = await this.isChildInQueue(childId, date);
    const isChildInSlot = await this.isChildInSlot(childId, date);
    if (isChildInQueue || isChildInSlot) throw new ConflictException();
    let res: RegisterInfoDto;
    const chilsInQueueAccepted = await this.prisma.queue.findFirst({
      // on verifie que la queue est vide
      where: {
        periodeId: periodeId,
        day: date,
        state: {
          in: ['ACCEPTED', 'PENDING'],
        },
      },
    });
    if (slots.length < periode.capacity && !chilsInQueueAccepted) {
      await this.prisma.slot.create({
        data: {
          day: date,
          childId: childId,
          periodeId: periodeId,
        },
      });
      res = { state: stateRegisterPeriode.ACCEPTED };
    } else {
      await this.prisma.queue.create({
        data: {
          day: date,
          childId: childId,
          periodeId: periodeId,
          state: 'PENDING',
        },
      });
      res = { state: stateRegisterPeriode.IN_QUEUE };
    }
    return res;
  }

  async isChildInQueue(childId: string, date: Date): Promise<boolean> {
    const queue = await this.prisma.queue.findFirst({
      where: {
        childId,
        day: date,
      },
    });
    return !!queue;
  }

  async isChildInSlot(childId: string, date: Date): Promise<boolean> {
    const slots = await this.prisma.slot.findFirst({
      where: {
        childId,
        day: date,
      },
    });
    return !!slots;
  }

  async accepteSlot(periodeId: string, queueId: string) {
    const queue = await this.prisma.queue.findUnique({
      where: {
        id: queueId,
      },
    });
    if (!queue) throw new NotFoundException();
    if (queue.periodeId != periodeId || queue.state != 'ACCEPTED')
      throw new BadRequestException();
    await this.prisma.slot.create({
      data: {
        day: queue.day,
        childId: queue.childId,
        periodeId: queue.periodeId,
      },
    });
    await this.prisma.queue.delete({
      where: {
        id: queue.id,
      },
    });
  }

  async leaveQueue(periodeId: string, queueId: string) {
    const queue = await this.prisma.queue.findUnique({
      where: {
        id: queueId,
        periodeId: periodeId,
      },
    });
    if (!queue) throw new NotFoundException();
    await this.prisma.queue.delete({
      where: {
        id: queueId,
      },
    });
    await this.updateDayInPeriode(queue.periodeId, queue.day);
  }

  async leaveSlots(periodeId: string, slotId: string) {
    const slot = await this.prisma.slot.findUnique({
      where: {
        id: slotId,
        periodeId: periodeId,
      },
    });
    if (!slot) throw new NotFoundException();
    await this.prisma.slot.delete({
      where: {
        id: slotId,
      },
    });
    await this.updateDayInPeriode(slot.periodeId, slot.day);
  }

  async getSlotsFromPeriode(periodeId: string): Promise<SlotInfoDto[]> {
    return await this.prisma.slot.findMany({
      where: {
        periodeId,
      },
      select: {
        id: true,
        child: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
        isChildPresent: true,
        day: true,
        periodeId: true,
      },
    });
  }

  async getQueueFromPeriode(periodeId: string): Promise<QueueInfoDto[]> {
    const periode = await this.getPeriodesById(periodeId);
    if (!periode) throw new NotFoundException();
    const queues = await this.prisma.queue.findMany({
      where: {
        periodeId,
      },
      select: {
        id: true,
        child: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
        day: true,
        state: true,
        acceptedAt: true,
        periodeId: true,
      },
    });
    return queues;
  }

  async setChildAttendance(slotId: string, data: attendanceDto): Promise<void> {
    await this.prisma.slot.update({
      where: {
        id: slotId,
      },
      data,
    });
  }
}
