import { Role, type RequestWithUser } from './../auth/dto/payload';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { guardianInfoDto } from './dto/guardianDto';
import { GuardianService } from './guardian.service';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { accessTokenAuthGuard } from 'src/auth/accessToken.auth.guard';

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
}
