import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class accessTokenAuthGuard extends AuthGuard('accessToken') {
  handleRequest(err: any, user: any, info: any) {
    return user || null;
  }
}
