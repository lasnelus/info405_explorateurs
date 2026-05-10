import { accessTokenAuthGuard } from './../auth/accessToken.auth.guard';
import { Role, type RequestWithUser } from '../auth/dto/payload';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PeriodeService } from './periode.service';
import {
  CreatePeriodeDto,
  PeriodeDtoOpt,
  PeriodeInfoDto,
} from './dto/periodeDto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto, RegisterInfoDto } from './dto/registerPeriodeDto';
import { attendanceDto, SlotInfoDto } from './dto/slotDto';
import { QueueInfoDto } from './dto/queueDto';

@Controller('periode')
export class PeriodeController {
  constructor(private readonly periodeService: PeriodeService) {}

  @Get()
  @ApiOperation({
    summary: 'fetch all periodes',
    description: 'fetch all periodes, admin auth required',
  })
  @ApiOkResponse({
    description: 'All periodes',
    type: PeriodeInfoDto,
    isArray: true,
  })
  async getPeriodes() {
    return await this.periodeService.getPeriodes();
  }

  @Post()
  @ApiOperation({
    summary: 'create a new periode',
    description: 'create a new periode, admin auth required',
  })
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
  @ApiOperation({
    summary: 'fetch a periode',
    description: 'fetch a periode',
  })
  @ApiOkResponse({
    description: 'Periode ask',
    type: PeriodeInfoDto,
  })
  @ApiNotFoundResponse({
    description: 'Periode not found',
  })
  async getPeriodesById(
    @Param('periodeId') periodeId: string,
  ): Promise<PeriodeInfoDto> {
    const periode = await this.periodeService.getPeriodesById(periodeId);
    if (!periode) throw new NotFoundException();
    return periode;
  }

  @Patch(':periodeId')
  @ApiOperation({
    summary: 'edit a periode',
    description: 'edit a periode',
  })
  @ApiBody({
    type: PeriodeDtoOpt,
  })
  @ApiOkResponse({
    description: 'Periode to edit',
    type: PeriodeInfoDto,
  })
  @ApiNotFoundResponse({
    description: 'Periode not found',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({
    description: 'role OWNER required !',
  })
  @UseGuards(accessTokenAuthGuard)
  @ApiBearerAuth('accessToken')
  async editPeriodesById(
    @Param('periodeId') periodeId: string,
    @Body() body: PeriodeDtoOpt,
    @Request() request: RequestWithUser,
  ): Promise<PeriodeInfoDto> {
    if (request.user.role != Role.OWNER) throw new ForbiddenException();
    const periode = await this.periodeService.getPeriodesById(periodeId);
    if (!periode) throw new NotFoundException();
    return (await this.periodeService.editPeriodesById(periodeId, body))!;
  }

  @Delete(':periodeId')
  @ApiOperation({
    summary: 'delete a periode',
    description: 'delete a periode',
  })
  @ApiOkResponse({
    description: 'Periode deleted',
  })
  @ApiNotFoundResponse({
    description: 'Periode not found',
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({
    description: 'role OWNER required !',
  })
  @UseGuards(accessTokenAuthGuard)
  @ApiBearerAuth('accessToken')
  async deletPeriodesById(
    @Param('periodeId') periodeId: string,
    @Request() request: RequestWithUser,
  ) {
    if (request.user.role != Role.GUARDIAN) throw new ForbiddenException();
    const periode = await this.periodeService.getPeriodesById(periodeId);
    if (!periode) throw new NotFoundException();
    await this.periodeService.deletePeriode(periodeId);
  }

  @Get(':periodeId/slots')
  @ApiOperation({
    summary: "fetch all periode's slots",
    description: "fetch all periode's slots for each day of the periode",
  })
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
  @ApiOperation({
    summary: "fetch all periode's queues",
    description: "fetch all periode's queues for each day of the periode",
  })
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
  @ApiOperation({
    summary: 'register a child to a periode',
    description:
      'registers a child in the queue or in the slots of a period for one day',
  })
  @ApiCreatedResponse({
    type: RegisterInfoDto,
  })
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

  @Post(':periodeId/queue/:queueId/accept')
  @ApiOperation({
    summary: 'Join a slot when child is in queue',
    description: 'Join a slot when child is in queue and ACCEPTED',
  })
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
  @ApiOperation({
    summary: 'leave a queue of a periode',
    description: 'leave a queue of a periode',
  })
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
  @ApiOperation({
    summary: 'leave a slot of a periode',
    description: 'leave a slot of a periode',
  })
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

  @Put(':periodeId/slot/:slotId/attendance')
  @ApiOperation({
    summary: 'set child attendance',
    description: 'set child attendance',
  })
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBearerAuth('accessToken')
  async setChildAttendance(
    @Request() request: RequestWithUser,
    @Param('periodeId') periodeId: string,
    @Param('slotId') slotId: string,
    @Body() body: attendanceDto,
  ) {
    if (request.user.role == 'GUARDIAN') throw new ForbiddenException();
    await this.periodeService.setChildAttendance(slotId, body);
  }
}
