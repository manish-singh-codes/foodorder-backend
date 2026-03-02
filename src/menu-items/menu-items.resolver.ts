// src/menu-items/menu-items.resolver.ts
import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from './entities/menu-item.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Resolver(() => MenuItem)
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuItemsResolver {
  constructor(private menuItemsService: MenuItemsService) {}

  @Query(() => [MenuItem])
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  menuItems(@Args('restaurantId', { type: () => ID }) restaurantId: string) {
    return this.menuItemsService.findByRestaurant(restaurantId);
  }

  @Query(() => MenuItem)
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  menuItem(@Args('id', { type: () => ID }) id: string) {
    return this.menuItemsService.findOne(id);
  }
}
