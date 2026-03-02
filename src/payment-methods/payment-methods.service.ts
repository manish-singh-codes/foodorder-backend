// src/payment-methods/payment-methods.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import { User } from '@prisma/client';

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  async create(input: CreatePaymentMethodInput, user: User) {
    // If setting as default, unset all existing defaults first
    if (input.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.create({
      data: { ...input, userId: user.id, country: user.country },
    });
  }

  async update(input: UpdatePaymentMethodInput, user: User) {
    const pm = await this.prisma.paymentMethod.findUniqueOrThrow({
      where: { id: input.id },
    });

    // Re-BAC: only manage payment methods in your own country
    if (pm.country !== user.country) {
      throw new ForbiddenException('Cannot modify payment methods outside your country');
    }

    if (input.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.update({
      where: { id: input.id },
      data: {
        ...(input.details && { details: input.details }),
        ...(input.isDefault !== undefined && { isDefault: input.isDefault }),
      },
    });
  }

  async delete(id: string, user: User) {
    const pm = await this.prisma.paymentMethod.findUniqueOrThrow({ where: { id } });
    if (pm.userId !== user.id) {
      throw new ForbiddenException('Cannot delete another user\'s payment method');
    }
    return this.prisma.paymentMethod.delete({ where: { id } });
  }

  findByUser(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  // Admin: view all payment methods in their country
  findAll(country: string) {
    return this.prisma.paymentMethod.findMany({
      where: { country: country as any },
      include: { user: true },
    });
  }
}
