// src/menu-items/menu-items.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  findByRestaurant(restaurantId: string) {
    return this.prisma.menuItem.findMany({
      where: { restaurantId, isAvailable: true },
      orderBy: { category: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.menuItem.findUniqueOrThrow({ where: { id } });
  }
}
