// src/users/users.resolver.ts
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  @Roles(Role.ADMIN)
  users() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @Roles(Role.ADMIN)
  user(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }
}
