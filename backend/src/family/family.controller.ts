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
import { FamilyCreationDto, FamilyDto } from './dto/familyDto';
import { FamilyService } from './family.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { accessTokenAuthGuard } from 'src/auth/accessToken.auth.guard';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}
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
