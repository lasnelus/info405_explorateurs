import { accessTokenAuthGuard } from './../auth/accessToken.auth.guard';
import { Role, type RequestWithUser } from './../auth/dto/payload';
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
import { ManagerService } from './manager.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ManagerInfoDto, registerManagerCredentials } from './dto/managerDto';

@UseGuards(accessTokenAuthGuard)
@ApiBearerAuth('accessToken')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @ApiOperation({
    summary: 'fetch all managers',
    description: 'fetch all managers',
  })
  @ApiOkResponse({
    type: ManagerInfoDto,
    isArray: true,
  })
  @ApiForbiddenResponse()
  @Get('')
  async getManagers(
    @Request() request: RequestWithUser,
  ): Promise<ManagerInfoDto[]> {
    if (request.user.role != Role.OWNER) throw new ForbiddenException();
    return await this.managerService.getManagers();
  }

  @ApiOperation({
    summary: 'register new account',
    description: 'Register a new manager account',
  })
  @ApiBody({
    type: registerManagerCredentials,
  })
  @ApiCreatedResponse({
    description: 'new account',
  })
  @ApiConflictResponse({
    description: 'email already used',
  })
  @ApiForbiddenResponse()
  @Post('')
  async register(
    @Body() registerBody: registerManagerCredentials,
    @Request() request: RequestWithUser,
  ) {
    if (request.user.role != Role.OWNER) throw new ForbiddenException();
    await this.managerService.register(registerBody);
  }

  @ApiOperation({
    summary: 'fetch a managers',
    description: 'fetch a managers',
  })
  @ApiOkResponse({
    type: ManagerInfoDto,
  })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @Get(':managerId')
  async getManagerById(
    @Request() request: RequestWithUser,
    @Param('managerId') managerId: string,
  ): Promise<ManagerInfoDto> {
    if (request.user.role != Role.OWNER) throw new ForbiddenException();
    const manager = await this.managerService.getManagerById(managerId);
    if (!manager) throw new NotFoundException();
    return manager;
  }

  @ApiOperation({
    summary: 'fetch a managers',
    description: 'fetch a managers',
  })
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @Patch(':managerId')
  async editManagerById(
    @Request() request: RequestWithUser,
    @Param('managerId') managerId: string,
  ) {
    if (request.user.role != Role.OWNER) throw new ForbiddenException();
    const manager = await this.managerService.getManagerById(managerId);
    if (!manager) throw new NotFoundException();
    await this.managerService.deleteManagerById(managerId);
  }

  @ApiOperation({
    summary: 'fetch a managers',
    description: 'fetch a managers',
  })
  @ApiOkResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @Delete(':managerId')
  async deleteManagerById(
    @Request() request: RequestWithUser,
    @Param('managerId') managerId: string,
  ) {
    if (request.user.role != Role.OWNER) throw new ForbiddenException();
    const manager = await this.managerService.getManagerById(managerId);
    if (!manager) throw new NotFoundException();
    await this.managerService.deleteManagerById(managerId);
  }
}
