import { Role } from './../auth/dto/payload';
import type { RequestWithUser } from './../auth/dto/payload';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FamilyCreationDto, FamilyDto, FamilyInfoDto } from './dto/familyDto';
import { FamilyService } from './family.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { accessTokenAuthGuard } from 'src/auth/accessToken.auth.guard';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Get()
  @ApiOperation({
    summary: 'fetch all families',
    description: 'fetch all families, admin auth required',
  })
  @ApiOkResponse({
    description: 'All families',
    type: FamilyInfoDto,
    isArray: true,
  })
  async getFamilies() {
    return await this.familyService.getFamilies();
  }

  @ApiCreatedResponse({
    description: 'creation successful',
  })
  @ApiBadRequestResponse({
    description: 'invalid body: name required',
  })
  @ApiNotFoundResponse({
    description: 'guardian not found',
  })
  @UseGuards(accessTokenAuthGuard)
  @Post('')
  async createFamily(
    @Body() familyBody: FamilyCreationDto,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    if ((request.user.role = Role.GUARDIAN)) {
      familyBody.guardianId = request.user.userId;
    }
    await this.familyService.createFamily(familyBody);
  }

  @ApiOkResponse({
    description: 'fetch with success',
    type: FamilyDto,
  })
  @UseGuards(accessTokenAuthGuard)
  @Get(':familyId')
  async getFamilyById(
    @Param('familyId') familyId: string,
    @Request() request: RequestWithUser,
  ): Promise<FamilyDto> {
    const user = request.user;
    const role = user.role;
    if (
      !(
        role == Role.OWNER ||
        role == Role.INSTRUCTOR ||
        (await this.familyService.isGuardianInFamily(user.userId, familyId))
      )
    )
      throw new ForbiddenException();
    return await this.familyService.getFamilyById(familyId);
  }
}
