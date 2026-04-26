import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePeriodeDto, PeriodeInfoDto } from './dto/periodeDto';
import { SlotInfoDto } from './dto/slotDto';
import {
  RegisterInfoDto,
  stateRegisterPeriode,
} from './dto/registerPeriodeDto';
import { QueueInfoDto } from './dto/queueDto';

@Injectable()
export class PeriodeService {
  constructor(private readonly prisma: PrismaService) {}
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

  async createPeriodes(creationBody: CreatePeriodeDto) {
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

  async deleteRegisterInPeriode(
    periodeId: string,
    childId: string,
    dateIso: string,
  ) {
    const date = this.extractDateFromCompleteDate(new Date(dateIso));
    const isChildInQueue = await this.isChildInQueue(childId, date);
    const isChildInSlot = await this.isChildInSlot(childId, date);
    if (!isChildInQueue && !isChildInSlot) throw new NotFoundException();
    if (isChildInQueue) {
      await this.prisma.queue.delete({
        where: {
          periodeId: periodeId,
          childId_day: {
            childId,
            day: date,
          },
        },
      });
    } else {
      await this.prisma.slot.delete({
        where: {
          periodeId: periodeId,
          childId_day: {
            childId,
            day: date,
          },
        },
      });
    }
    const userToAcceptInQueue = await this.prisma.queue.findFirst({
      where: {
        periodeId: periodeId,
        day: date,
        state: 'PENDING',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    if (userToAcceptInQueue) {
      await this.prisma.queue.update({
        where: {
          childId_day: {
            childId: userToAcceptInQueue.childId,
            day: date,
          },
          periodeId: periodeId,
        },
        data: {
          state: 'ACCEPTED',
          acceptedAt: new Date(),
        },
      });
    }
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
}
