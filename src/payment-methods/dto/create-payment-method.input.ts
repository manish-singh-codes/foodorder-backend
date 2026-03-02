// src/payment-methods/dto/create-payment-method.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentType } from '../entities/payment-method.entity';

@InputType()
export class CreatePaymentMethodInput {
  @Field(() => PaymentType)
  @IsEnum(PaymentType)
  type!: PaymentType;

  @Field()
  @IsNotEmpty()
  details!: string; // last 4 digits for card, UPI ID, wallet ID

  @Field({ defaultValue: false })
  isDefault!: boolean;
}
