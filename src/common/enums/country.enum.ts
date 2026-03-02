// src/common/enums/country.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum Country {
  INDIA = 'INDIA',
  AMERICA = 'AMERICA',
}
registerEnumType(Country, { name: 'Country' });
