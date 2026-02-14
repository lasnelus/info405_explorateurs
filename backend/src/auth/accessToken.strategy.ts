import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserPayload } from './dto/payload';

@Injectable()
export class accessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor() {
    const secret = process.env.ACCESSTOKEN_SECRET;
    if (!secret) {
      throw new Error('ACCESSTOKEN_SECRET must be defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: UserPayload) {
    return {
      userId: payload.userId,
      role: payload.role,
    };
  }
}
