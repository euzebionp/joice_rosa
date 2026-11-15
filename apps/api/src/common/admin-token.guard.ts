import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.header('x-admin-token');
    const expected = process.env.ADMIN_TOKEN ?? 'dev-admin-token';

    if (!token || token !== expected) {
      throw new UnauthorizedException('Token administrativo inválido.');
    }

    return true;
  }
}
