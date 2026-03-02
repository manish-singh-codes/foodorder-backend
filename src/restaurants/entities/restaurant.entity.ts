// src/restaurants/entities/restaurant.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from '../../common/enums/country.enum';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';

@ObjectType()
export class Restaurant {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field() cuisine!: string;
  @Field() address!: string;
  @Field(() => Country) country!: Country;
  @Field({ nullable: true }) imageUrl?: string;
  @Field() isActive!: boolean;
  @Field() createdAt!: Date;

  // ✅ Add this
  @Field(() => [MenuItem], { nullable: true })
  menuItems?: MenuItem[];
}
