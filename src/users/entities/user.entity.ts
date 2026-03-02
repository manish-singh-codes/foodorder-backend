// src/users/entities/user.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../../common/enums/role.enum';
import { Country } from '../../common/enums/country.enum';

@ObjectType()
export class User {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field() email!: string;
  // password intentionally omitted from GraphQL schema
  @Field(() => Role) role!: Role;
  @Field(() => Country) country!: Country;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
}
