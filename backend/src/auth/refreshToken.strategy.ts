import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from './dto/payload';

@Injectable()
export class refreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor() {
    const secret = process.env.REFRESHTOKEN_SECRET;
    if (!secret) {
      throw new Error('REFRESHTOKEN_SECRET must be defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([<JwtFromRequestFunction>((
          req: Request,
        ) => {
          if (!req) return null;

          const cookieName =
            process.env.REFRESHTOKEN_COOKIE_NAME ?? 'refresh_token';

          return req.cookies?.[cookieName] ?? null;
        })]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: UserPayload): UserPayload {
    return {
      userId: payload.userId,
      role: payload.role,
    };
  }
}
