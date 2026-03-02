// src/orders/entities/order.entity.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Country } from '../../common/enums/country.enum';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity'; // ✅ import

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
}

import { registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderItemEntity {
  @Field(() => ID) id!: string;
  @Field() menuItemId!: string;
  @Field(() => MenuItem, { nullable: true }) menuItem?: MenuItem;
  @Field() quantity!: number;
  @Field(() => Float) unitPrice!: number;
}

@ObjectType()
export class Order {
  @Field(() => ID) id!: string;
  @Field(() => OrderStatus) status!: OrderStatus;
  @Field(() => Float) totalAmount!: number;
  @Field(() => Country) country!: Country;
  @Field() userId!: string;
   @Field(() => User, { nullable: true }) user?: User; // ✅ add this
  @Field() restaurantId!: string;
  @Field(() => Restaurant, { nullable: true }) restaurant?: Restaurant; // ✅ add this
  @Field({ nullable: true }) paymentMethodId?: string;
  @Field(() => [OrderItemEntity]) orderItems!: OrderItemEntity[];
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
}
