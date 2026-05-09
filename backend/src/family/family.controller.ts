import { Role } from './../auth/dto/payload';
import type { RequestWithUser } from './../auth/dto/payload';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  FamilyCreationDto,
  FamilyDto,
  FamilyInfoDto,
  FamilyDtoOpt,
} from './dto/familyDto';
import { FamilyService } from './family.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { accessTokenAuthGuard } from 'src/auth/accessToken.auth.guard';

@UseGuards(accessTokenAuthGuard)
@ApiBearerAuth('accessToken')
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

  @ApiOkResponse({
    description: 'edited with success',
    type: FamilyInfoDto,
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Patch(':familyId')
  async editFamilyById(
    @Param('familyId') familyId: string,
    @Request() request: RequestWithUser,
    @Body() body: FamilyDtoOpt,
  ): Promise<FamilyInfoDto> {
    const user = request.user;
    const role = user.role;
    if (role == 'GUARDIAN') throw new ForbiddenException();
    const family = await this.familyService.getFamilyById(familyId);
    if (!family) throw new NotFoundException();
    return await this.familyService.editFamily(familyId, body);
  }

  @ApiOkResponse({
    description: 'deleted with success',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Delete(':familyId')
  async deleteFamilyById(
    @Param('familyId') familyId: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const user = request.user;
    const role = user.role;
    if (role == 'GUARDIAN') throw new ForbiddenException();
    const family = await this.familyService.getFamilyById(familyId);
    if (!family) throw new NotFoundException();
    await this.familyService.deleteFamily(familyId);
  }
}
