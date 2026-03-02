// src/common/guards/country-scope.guard.ts
import {
  Injectable, CanActivate, ExecutionContext, ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CountryScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    const args = ctx.getArgs<{ country?: string; input?: { country?: string } }>();

    const targetCountry = args.country ?? args.input?.country;
    if (targetCountry && user.country !== targetCountry) {
      throw new ForbiddenException(
        `Access denied: You can only operate within ${user.country}`,
      );
    }
    return true;
  }
}
