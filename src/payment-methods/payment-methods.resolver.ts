// src/payment-methods/payment-methods.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Resolver(() => PaymentMethod)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentMethodsResolver {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  // ✅ ADMIN only: add payment method
  @Mutation(() => PaymentMethod)
  @Roles(Role.ADMIN)
  addPaymentMethod(
    @Args('input') input: CreatePaymentMethodInput,
    @CurrentUser() user: User,
  ) {
    return this.paymentMethodsService.create(input, user);
  }

  // ✅ ADMIN only: update payment method
  @Mutation(() => PaymentMethod)
  @Roles(Role.ADMIN)
  updatePaymentMethod(
    @Args('input') input: UpdatePaymentMethodInput,
    @CurrentUser() user: User,
  ) {
    return this.paymentMethodsService.update(input, user);
  }

  // ✅ ADMIN only: delete payment method
  @Mutation(() => PaymentMethod)
  @Roles(Role.ADMIN)
  deletePaymentMethod(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.paymentMethodsService.delete(id, user);
  }

  // ✅ ALL roles: view own payment methods (for checkout)
  @Query(() => [PaymentMethod])
  @Roles(Role.ADMIN, Role.MANAGER, Role.MEMBER)
  myPaymentMethods(@CurrentUser() user: User) {
    return this.paymentMethodsService.findByUser(user.id);
  }

  // ✅ ADMIN only: view all payment methods in country
  @Query(() => [PaymentMethod])
  @Roles(Role.ADMIN)
  allPaymentMethods(@CurrentUser() user: User) {
    return this.paymentMethodsService.findAll(user.country);
  }
}
