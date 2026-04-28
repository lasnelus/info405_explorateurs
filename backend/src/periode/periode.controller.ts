import { accessTokenAuthGuard } from './../auth/accessToken.auth.guard';
import { Role, type RequestWithUser } from '../auth/dto/payload';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PeriodeService } from './periode.service';
import { CreatePeriodeDto } from './dto/periodeDto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto, RegisterInfoDto } from './dto/registerPeriodeDto';
import { SlotInfoDto } from './dto/slotDto';
import { QueueInfoDto } from './dto/queueDto';

@Controller('periode')
export class PeriodeController {
  constructor(private readonly periodeService: PeriodeService) {}
  @Get()
  async getPeriodes() {
    return await this.periodeService.getPeriodes();
  }

  @Post()
  @ApiBody({ type: CreatePeriodeDto })
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenAuthGuard)
  async createPeriodes(
    @Body() creationBody: CreatePeriodeDto,
    @Request() request: RequestWithUser,
  ) {
    if (request.user.role == Role.GUARDIAN) throw new ForbiddenException();
    await this.periodeService.createPeriodes(creationBody);
  }

  @Get(':periodeId')
  async getPeriodesById(@Param('periodeId') periodeId: string) {
    return await this.periodeService.getPeriodesById(periodeId);
  }

  @Get(':periodeId/slots')
  @ApiOkResponse({ type: SlotInfoDto, isArray: true })
  @UseGuards(accessTokenAuthGuard)
  @ApiBearerAuth('accessToken')
  async getSlotsFromPeriode(
    @Request() request: RequestWithUser,
    @Param('periodeId') periodeId: string,
  ): Promise<SlotInfoDto[]> {
    return await this.periodeService.getSlotsFromPeriode(periodeId);
  }

  @Get(':periodeId/queues')
  @ApiOkResponse({ type: QueueInfoDto, isArray: true })
  @UseGuards(accessTokenAuthGuard)
  @ApiBearerAuth('accessToken')
  async getQueueFromPeriode(
    @Request() request: RequestWithUser,
    @Param('periodeId') periodeId: string,
  ): Promise<QueueInfoDto[]> {
    return await this.periodeService.getQueueFromPeriode(periodeId);
  }

  @Post(':periodeId/register')
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenAuthGuard)
  async registerInPeriode(
    @Param('periodeId') periodeId: string,
    @Request() request: RequestWithUser,
    @Body() boby: RegisterDto,
  ): Promise<RegisterInfoDto> {
    if (request.user.role != Role.GUARDIAN) throw new BadRequestException();
    return await this.periodeService.registerInPeriode(
      periodeId,
      boby.childId,
      boby.date,
    );
  }

  @Delete(':periodeId/register')
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBearerAuth('accessToken')
  @UseGuards(accessTokenAuthGuard)
  async deleteRegisterInPeriode(
    @Param('periodeId') periodeId: string,
    @Request() request: RequestWithUser,
    @Body() boby: RegisterDto,
  ) {
    await this.periodeService.deleteRegisterInPeriode(
      periodeId,
      boby.childId,
      boby.date,
    );
  }

  @Post(':periodeId/queue/:queueId/accept')
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('accessToken')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  async accepteSlot(
    @Request() request: RequestWithUser,
    @Param('periodeId') periodeId: string,
    @Param('queueId') queueId: string,
  ) {
    await this.periodeService.accepteSlot(periodeId, queueId);
  }

  @Delete(':periodeId/queue/:queueId')
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth('accessToken')
  async leaveQueue(
    @Request() request: RequestWithUser,
    @Param('periodeId') periodeId: string,
    @Param('queueId') queueId: string,
  ) {
    await this.periodeService.leaveQueue(periodeId, queueId);
  }

  @Delete(':periodeId/slot/:slotId')
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth('accessToken')
  async leaveSlot(
    @Request() request: RequestWithUser,
    @Param('periodeId') periodeId: string,
    @Param('slotId') slotId: string,
  ) {
    await this.periodeService.leaveSlots(periodeId, slotId);
  }
}
