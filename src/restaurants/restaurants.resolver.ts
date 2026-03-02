// src/restaurants/restaurants.resolver.ts
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Restaurant)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsResolver {
  constructor(private restaurantsService: RestaurantsService) {}

  // Re-BAC: automatically scoped to user's country
  @Query(() => [Restaurant])
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  restaurants(@CurrentUser() user: User) {
    console.log("inside the api call")
    return this.restaurantsService.findAll(user.country as any);
  }

  @Query(() => Restaurant)
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  restaurant(@Args('id', { type: () => ID }) id: string) {
    return this.restaurantsService.findOne(id);
  }
}
