// src/orders/orders.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { CheckoutOrderInput } from './dto/checkout-order.input';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Resolver(() => Order)
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  // ✅ ALL roles: create order
  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.createOrder(input, user);
  }

  // ✅ ADMIN + MANAGER only: checkout
  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER)
  checkoutOrder(
    @Args('input') input: CheckoutOrderInput,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.checkoutOrder(input, user);
  }

  // ✅ ADMIN + MANAGER only: cancel
  @Mutation(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER)
  cancelOrder(
    @Args('orderId', { type: () => ID }) orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.cancelOrder(orderId, user);
  }

  // ✅ ALL roles: view own orders
  @Query(() => [Order])
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  myOrders(@CurrentUser() user: User) {
    return this.ordersService.findMyOrders(user.id);
  }

  // ✅ ADMIN only: view all orders in country
  @Query(() => [Order])
  @Roles(Role.ADMIN)
  allOrders(@CurrentUser() user: User) {
    return this.ordersService.findAllOrders(user.country);
  }

  @Query(() => Order)
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  order(@Args('id', { type: () => ID }) id: string) {
    return this.ordersService.findOne(id);
  }
}
