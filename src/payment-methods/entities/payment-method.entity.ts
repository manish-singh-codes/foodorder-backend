// src/payment-methods/entities/payment-method.entity.ts
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Country } from '../../common/enums/country.enum';

export enum PaymentType {
  CARD = 'CARD',
  UPI = 'UPI',
  WALLET = 'WALLET',
}
registerEnumType(PaymentType, { name: 'PaymentType' });

@ObjectType()
export class PaymentMethod {
  @Field(() => ID) id!: string;
  @Field(() => PaymentType) type!: PaymentType;
  @Field() details!: string;
  @Field() isDefault!: boolean;
  @Field(() => Country) country!: Country;
  @Field() userId!: string;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
}
