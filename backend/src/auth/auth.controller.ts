import {
  Body,
  Controller,
  Get,
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
import { accessTokenAuthGuard } from './accessToken.auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { accessTokenDto, RoleResponseDto } from './dto/payload.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiCreatedResponse({
    description: 'login successful',
  })
  @ApiUnauthorizedResponse({
    description: 'invalid password',
  })
  @ApiBadRequestResponse({
    description: 'invalid body: password and email are required',
  })
  @Post('login')
  async login(
    @Body() authBody: CredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.login(authBody, response);
  }

  @ApiCookieAuth()
  @ApiCreatedResponse({
    description: 'new access token',
    type: accessTokenDto,
  })
  @ApiUnauthorizedResponse({
    description: 'invalid or missing refresh token',
  })
  @UseGuards(refreshTokenAuthGuard)
  @Post('refresh')
  refresh(@Request() request: RequestWithUser): accessTokenDto {
    const accessToken = this.authService.getAccessToken(request.user);
    return {
      accessToken,
    };
  }

  @ApiBearerAuth('accessToken')
  @ApiOkResponse({
    type: RoleResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'invalid or missing access token',
  })
  @UseGuards(accessTokenAuthGuard)
  @Get('role')
  get(@Request() request: RequestWithUser): RoleResponseDto {
    return { role: request.user.role };
  }

  @ApiOperation({
    summary: 'clear refresh token cookie',
  })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(process.env.REFRESHTOKEN_COOKIE_NAME || 'refresh_token', {
      httpOnly: true,
      secure: process.env.PRODUCTION === 'true',
      sameSite: 'strict',
      path: '/',
    });
  }
}
