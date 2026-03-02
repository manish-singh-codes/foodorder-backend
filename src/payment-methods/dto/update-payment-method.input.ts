// src/payment-methods/dto/update-payment-method.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentMethodInput {
  @Field(() => ID) id!: string;
  @Field({ nullable: true }) details?: string;
  @Field({ nullable: true }) isDefault?: boolean;
}
