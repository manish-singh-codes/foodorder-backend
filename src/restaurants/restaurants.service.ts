// src/restaurants/restaurants.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country } from '../common/enums/country.enum';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  findAll(country: Country) {
    return this.prisma.restaurant.findMany({
      where: { country, isActive: true },
      include: { menuItems: true },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.restaurant.findUniqueOrThrow({
      where: { id },
      include: { menuItems: { where: { isAvailable: true } } },
    });
  }
}
