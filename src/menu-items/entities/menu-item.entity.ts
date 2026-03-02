// src/menu-items/entities/menu-item.entity.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class MenuItem {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field({ nullable: true }) description?: string;
  @Field(() => Float) price!: number;
  @Field() category!: string;
  @Field({ nullable: true }) imageUrl?: string;
  @Field() isAvailable!: boolean;
  @Field() restaurantId!: string;
  @Field() createdAt!: Date;
}
