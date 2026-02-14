import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import type { Response } from 'express';
import type { RequestWithUser } from './dto/payload';
import { refreshTokenAuthGuard } from './refreshToken.auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Body() authBody: CredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.login(authBody, response);
  }

  @UseGuards(refreshTokenAuthGuard)
  @Post('refresh')
  refresh(@Request() request: RequestWithUser): { accessToken: string } {
    const accessToken = this.authService.getAccessToken(request.user);
    return {
      accessToken,
    };
  }
}
