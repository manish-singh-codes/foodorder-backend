// src/orders/orders.service.ts
import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { CheckoutOrderInput } from './dto/checkout-order.input';
import { User } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(input: CreateOrderInput, user: User) {
    // 1. Validate restaurant belongs to user's country (Re-BAC)
    const restaurant = await this.prisma.restaurant.findUniqueOrThrow({
      where: { id: input.restaurantId },
    });
    if (restaurant.country !== user.country) {
      throw new ForbiddenException('Restaurant is not in your country');
    }

    // 2. Fetch menu items and compute total
    const menuItemIds = input.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, restaurantId: input.restaurantId },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more menu items are invalid');
    }

    const priceMap = new Map(menuItems.map((m) => [m.id, m.price]));
    const totalAmount = input.items.reduce(
      (sum, item) => sum + (priceMap.get(item.menuItemId) ?? 0) * item.quantity,
      0,
    );

    // 3. Create order with items
    return this.prisma.order.create({
      data: {
        userId: user.id,
        restaurantId: input.restaurantId,
        country: user.country,
        totalAmount,
        orderItems: {
          create: input.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: priceMap.get(item.menuItemId)!,
          })),
        },
      },
      include: { orderItems: true, restaurant: true },
    });
  }

  async checkoutOrder(input: CheckoutOrderInput, user: User) {
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: input.orderId },
    });

    if (order.status !== 'PENDING') {
      throw new BadRequestException(`Order is already ${order.status}`);
    }

    // Non-admin users can only checkout their own orders
    if (user.role === 'MEMBER') {
      throw new ForbiddenException('Members cannot checkout orders');
    }
    if (user.role === 'MANAGER' && order.userId !== user.id) {
      throw new ForbiddenException('Managers can only checkout their own orders');
    }

    // Re-BAC: validate payment method country
    const paymentMethod = await this.prisma.paymentMethod.findUniqueOrThrow({
      where: { id: input.paymentMethodId },
    });
    if (paymentMethod.country !== user.country) {
      throw new ForbiddenException('Payment method is not valid for your country');
    }

    return this.prisma.order.update({
      where: { id: input.orderId },
      data: { status: 'PAID', paymentMethodId: input.paymentMethodId },
      include: { orderItems: true },
    });
  }

  async cancelOrder(orderId: string, user: User) {
    const order = await this.prisma.order.findUniqueOrThrow({ where: { id: orderId } });

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException(`Cannot cancel an order with status: ${order.status}`);
    }

    if (user.role === 'MANAGER' && order.userId !== user.id) {
      throw new ForbiddenException('Managers can only cancel their own orders');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { orderItems: true },
    });
  }

  findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { menuItem: true } }, restaurant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin: view all orders scoped to their country
  findAllOrders(country: string) {
    return this.prisma.order.findMany({
      where: { country: country as any },
      include: { orderItems: true, user: true, restaurant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUniqueOrThrow({
      where: { id },
      include: { orderItems: { include: { menuItem: true } }, restaurant: true },
    });
  }
}
