import { accessTokenAuthGuard } from './../auth/accessToken.auth.guard';
import { Role, type RequestWithUser } from './../auth/dto/payload';
import {
  Body,
  Controller,
  ForbiddenException,
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
  ApiOperation,
} from '@nestjs/swagger';
import { registerManagerCredentials } from './dto/managerDto';

@UseGuards(accessTokenAuthGuard)
@ApiBearerAuth('accessToken')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

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
}
