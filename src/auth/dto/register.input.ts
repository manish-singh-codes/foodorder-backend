// src/auth/dto/register.input.ts
import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  MinLength,
  IsEnum,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { Country } from '../../common/enums/country.enum';

@InputType()
export class RegisterInput {
  @Field()
  @IsString() // ✅ add this
  @IsNotEmpty() // ✅ add this
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(6)
  password!: string;

  @Field(() => Role)
  @IsEnum(Role)
  role!: Role;

  @Field(() => Country)
  @IsEnum(Country)
  country!: Country;
}
