// src/menu-items/menu-items.module.ts
import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsResolver } from './menu-items.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [MenuItemsService, MenuItemsResolver, PrismaService],
})
export class MenuItemsModule {}
