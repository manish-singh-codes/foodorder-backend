// src/orders/dto/create-order.input.ts
import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { IsUUID, IsArray, Min, ArrayNotEmpty } from 'class-validator';

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  @IsUUID()
  menuItemId!: string;

  @Field(() => Int)
  @Min(1)
  quantity!: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  @IsUUID()
  restaurantId!: string;

  @Field(() => [OrderItemInput])
  @IsArray()
  @ArrayNotEmpty()
  items!: OrderItemInput[];
}
