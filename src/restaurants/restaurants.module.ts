// src/restaurants/restaurants.module.ts
import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsResolver } from './restaurants.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({providers: [RestaurantsService, RestaurantsResolver] })
export class RestaurantsModule {}
