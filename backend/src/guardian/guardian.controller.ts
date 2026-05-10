import { Role, type RequestWithUser } from './../auth/dto/payload';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  guardianDtoOpt,
  guardianInfoDto,
  registerGuardianCredentials,
} from './dto/guardianDto';
import { GuardianService } from './guardian.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { accessTokenAuthGuard } from 'src/auth/accessToken.auth.guard';
import type { Response } from 'express';

@Controller('guardian')
export class GuardianController {
  constructor(private readonly guardianService: GuardianService) {}

  @ApiOperation({
    summary: 'fetch all guardians',
    description: 'fetch all guardians, admin auth required',
  })
  @ApiResponse({
    status: 200,
    description: 'fetch with success',
    type: guardianInfoDto,
    isArray: true,
  })
  @Get('')
  async getAllGuardianInfo(): Promise<guardianInfoDto[]> {
    return await this.guardianService.getAllGuardians();
  }

  @ApiOperation({
    summary: 'register new account',
    description: 'Register a new guardian accounté',
  })
  @ApiBody({
    type: registerGuardianCredentials,
  })
  @ApiCreatedResponse({
    description: 'new account',
  })
  @ApiConflictResponse({
    description: 'email already used',
  })
  @Post('')
  async register(
    @Body() registerBody: registerGuardianCredentials,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.guardianService.register(registerBody, response);
  }

  @ApiOperation({
    summary: "fetch guardian's informations",
    description:
      "fetch the guardian's information via their identification token during a his login",
  })
  @ApiResponse({
    status: 200,
    description: 'fetch with success',
    type: guardianInfoDto,
  })
  @ApiNotFoundResponse({
    description: 'guardian not found',
  })
  @UseGuards(accessTokenAuthGuard)
  @ApiBadRequestResponse({
    description:
      "if you're not a guardian you can't fetch your guardian information",
  })
  @Get('me')
  async getMyGuardianInfo(
    @Request() request: RequestWithUser,
  ): Promise<guardianInfoDto> {
    if (request.user.role != Role.GUARDIAN) throw new BadRequestException();
    const guardianId: string = request.user.userId;
    return await this.guardianService.getGuardian(guardianId);
  }

  @ApiOperation({
    summary: "fetch guardian's informations",
  })
  @ApiResponse({
    status: 200,
    description: 'fetch with success',
    type: guardianInfoDto,
  })
  @ApiNotFoundResponse({
    description: 'guardian not found',
  })
  @Get(':guardianId')
  async getGuardianInfo(
    @Param('guardianId') guardianId: string,
  ): Promise<guardianInfoDto> {
    return await this.guardianService.getGuardian(guardianId);
  }

  @ApiOperation({
    summary: "edit guardian's informations",
  })
  @ApiBody({
    type: guardianDtoOpt,
  })
  @ApiResponse({
    description: 'edit with success',
    type: guardianInfoDto,
  })
  @ApiNotFoundResponse({
    description: 'guardian not found',
  })
  @Patch(':guardianId')
  async editGuardianInfo(
    @Param('guardianId') guardianId: string,
    @Body() body: guardianDtoOpt,
  ): Promise<void> {
    await this.guardianService.getGuardian(guardianId);
    await this.guardianService.editGuardian(guardianId, body);
  }

  @ApiOperation({
    summary: 'delete a guardian',
  })
  @ApiResponse({
    description: 'delete with success',
    type: guardianInfoDto,
  })
  @ApiNotFoundResponse({
    description: 'guardian not found',
  })
  @Delete(':guardianId')
  async deleteGuardianInfo(
    @Param('guardianId') guardianId: string,
  ): Promise<void> {
    await this.guardianService.getGuardian(guardianId);
    await this.guardianService.deleteGuardian(guardianId);
  }
}
