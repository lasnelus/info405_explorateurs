import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { guardianInfoDto } from './dto/guardianDto';
import { GuardianService } from './guardian.service';
import { Controller, Get, Param } from '@nestjs/common';

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
  @Get('me')
  async getMyGuardianInfo(): Promise<guardianInfoDto> {
    const guardianId: string = 'cmkv7yhjs0000hwjmuo9c1c2h'; // to change with JWT token implementation
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
