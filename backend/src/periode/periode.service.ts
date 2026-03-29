import { PrismaService } from './../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePeriodeDto, PeriodeInfoDto } from './dto/periodeDto';
import { SlotInfoDto } from './dto/slotDto';
import {
  RegisterInfoDto,
  stateRegisterPeriode,
} from './dto/registerPeriodeDto';

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
    perdiodeId: string,
    childId: string,
    dateIso: string,
  ): Promise<RegisterInfoDto> {
    const date = this.extractDateFromCompleteDate(new Date(dateIso));
    const periode = await this.getPeriodesById(perdiodeId);
    if (!periode || date < periode.firstDay || date > periode.lastDay)
      throw new BadRequestException();
    const slots = await this.getSlotsByPeriodeAndDay(perdiodeId, date);
    let res: RegisterInfoDto;
    if (slots.length < periode.capacity) {
      await this.prisma.slot.create({
        data: {
          day: date,
          childId: childId,
          periodeId: perdiodeId,
        },
      });
      res = { state: stateRegisterPeriode.ACCEPTED };
    } else {
      await this.prisma.queue.create({
        data: {
          day: date,
          childId: childId,
          periodeId: perdiodeId,
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
}
