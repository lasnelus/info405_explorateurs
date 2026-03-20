import { accessTokenAuthGuard } from './../auth/accessToken.auth.guard';
import {
  Role,
  type RequestWithUser,
} from './../../dist/src/auth/dto/payload.d';
import {
  BadRequestException,
  Body,
  Controller,
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
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto, RegisterInfoDto } from './dto/registerPeriodeDto';

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
  @UseGuards(accessTokenAuthGuard)
  async createPeriodes(
    @Body() creationBody: CreatePeriodeDto,
    @Request() request: RequestWithUser,
  ) {
    if (request.user.role == Role.GUARDIAN) throw new ForbiddenException();
    await this.periodeService.createPeriodes(creationBody);
  }

  @Get(':perdiodeId')
  async getPeriodesById(@Param('perdiodeId') perdiodeId: string) {
    return await this.periodeService.getPeriodesById(perdiodeId);
  }

  @Post(':perdiodeId/register')
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @UseGuards(accessTokenAuthGuard)
  async registerInPeriode(
    @Param('perdiodeId') perdiodeId: string,
    @Request() request: RequestWithUser,
    @Body() boby: RegisterDto,
  ): Promise<RegisterInfoDto> {
    if (request.user.role != Role.GUARDIAN) throw new BadRequestException();
    return await this.periodeService.registerInPeriode(
      perdiodeId,
      boby.childId,
      boby.date,
    );
  }
}
