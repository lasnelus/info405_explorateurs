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
    if (request.user.role != Role.OWNER) throw new ForbiddenException();
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

  @ApiOperation({
    summary: 'add a child in a family',
    description: 'add a child in a family',
  })
  @ApiCreatedResponse({
    description: 'connected with success',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Post(':familyId/childs/:childId')
  async addChildFamilyById(
    @Param('familyId') familyId: string,
    @Param('childId') childId: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const user = request.user;
    const role = user.role;
    if (role == 'GUARDIAN') throw new ForbiddenException();
    const family = await this.familyService.getFamilyById(familyId);
    const child = await this.familyService.getChild(childId);
    if (!family || !child) throw new NotFoundException();
    await this.familyService.connectChild(familyId, childId);
  }

  @ApiOperation({
    summary: 'remove a child of a family',
    description: 'remove a child of a family',
  })
  @ApiOkResponse({
    description: 'disconnected with success',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Delete(':familyId/childs/:childId')
  async removeChildFamilyById(
    @Param('familyId') familyId: string,
    @Param('childId') childId: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const user = request.user;
    const role = user.role;
    if (role == 'GUARDIAN') throw new ForbiddenException();
    const family = await this.familyService.getFamilyById(familyId);
    const child = await this.familyService.getChild(childId);
    if (!family || !child) throw new NotFoundException();
    await this.familyService.disconnectChild(familyId, childId);
  }

  @ApiOperation({
    summary: 'add a guardian in a family',
    description: 'add a guardian in a family',
  })
  @ApiCreatedResponse({
    description: 'connected with success',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Post(':familyId/guardians/:guardianId')
  async addGuardianFamilyById(
    @Param('familyId') familyId: string,
    @Param('guardianId') guardianId: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const user = request.user;
    const role = user.role;
    if (role == 'GUARDIAN') throw new ForbiddenException();
    const family = await this.familyService.getFamilyById(familyId);
    const guardian = await this.familyService.getGuardian(guardianId);
    if (!family || !guardian) throw new NotFoundException();
    await this.familyService.connectGuardian(familyId, guardianId);
  }

  @ApiOperation({
    summary: 'remove a guardian of a family',
    description: 'remove a guardian of a family',
  })
  @ApiOkResponse({
    description: 'disconnected with success',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @Delete(':familyId/guardians/:guardianId')
  async removeGuardianFamilyById(
    @Param('familyId') familyId: string,
    @Param('guardianId') guardianId: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    const user = request.user;
    const role = user.role;
    if (role == 'GUARDIAN') throw new ForbiddenException();
    const family = await this.familyService.getFamilyById(familyId);
    const guardian = await this.familyService.getGuardian(guardianId);
    if (!family || !guardian) throw new NotFoundException();
    await this.familyService.disconnectGuardian(familyId, guardianId);
  }
}
