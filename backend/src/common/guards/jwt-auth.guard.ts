import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T>(error: unknown, user: T): T {
    if (error || !user) {
      throw new UnauthorizedException('Avtorizatsiyadan o‘tilmagan yoki token muddati tugagan');
    }
    return user;
  }
}
