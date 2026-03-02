// prisma/seed.ts
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';

config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Seed Users
  const adminIndia = await prisma.user.upsert({
    where: { email: 'admin.india@food.com' },
    update: {},
    create: {
      name: 'Arjun Admin',
      email: 'admin.india@food.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
      country: 'INDIA',
    },
  });

  const managerIndia = await prisma.user.upsert({
    where: { email: 'manager.india@food.com' },
    update: {},
    create: {
      name: 'Priya Manager',
      email: 'manager.india@food.com',
      password: await bcrypt.hash('password123', 10),
      role: 'MANAGER',
      country: 'INDIA',
    },
  });

  const memberIndia = await prisma.user.upsert({
    where: { email: 'member.india@food.com' },
    update: {},
    create: {
      name: 'Rahul Member',
      email: 'member.india@food.com',
      password: await bcrypt.hash('password123', 10),
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const adminAmerica = await prisma.user.upsert({
    where: { email: 'admin.america@food.com' },
    update: {},
    create: {
      name: 'John Admin',
      email: 'admin.america@food.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ADMIN',
      country: 'AMERICA',
    },
  });

  // Seed India Restaurants
  const spiceGarden = await prisma.restaurant.create({
    data: {
      name: 'Spice Garden',
      cuisine: 'North Indian',
      address: 'Connaught Place, New Delhi',
      country: 'INDIA',
      menuItems: {
        create: [
          { name: 'Butter Chicken', price: 320, category: 'Main Course', description: 'Creamy tomato-based chicken curry' },
          { name: 'Dal Makhani', price: 240, category: 'Main Course', description: 'Slow-cooked black lentils' },
          { name: 'Garlic Naan', price: 60, category: 'Bread', description: 'Leavened bread with garlic' },
          { name: 'Mango Lassi', price: 80, category: 'Drinks', description: 'Chilled mango yogurt drink' },
        ],
      },
    },
  });

  const mumbaiBites = await prisma.restaurant.create({
    data: {
      name: 'Mumbai Bites',
      cuisine: 'Street Food',
      address: 'Bandra West, Mumbai',
      country: 'INDIA',
      menuItems: {
        create: [
          { name: 'Vada Pav', price: 40, category: 'Snacks', description: 'Mumbai\'s favorite street burger' },
          { name: 'Pav Bhaji', price: 120, category: 'Main Course', description: 'Spiced vegetable mash with bread' },
          { name: 'Misal Pav', price: 90, category: 'Breakfast', description: 'Spicy sprout curry with bread' },
          { name: 'Cutting Chai', price: 20, category: 'Drinks', description: 'Half-cup strong masala tea' },
        ],
      },
    },
  });

  // Seed America Restaurants
  const burgerPalace = await prisma.restaurant.create({
    data: {
      name: 'Burger Palace',
      cuisine: 'American',
      address: '5th Avenue, New York, NY',
      country: 'AMERICA',
      menuItems: {
        create: [
          { name: 'Classic Cheeseburger', price: 12.99, category: 'Burgers', description: 'Beef patty with cheddar' },
          { name: 'BBQ Bacon Burger', price: 15.99, category: 'Burgers', description: 'Smoky BBQ with crispy bacon' },
          { name: 'Truffle Fries', price: 7.99, category: 'Sides', description: 'Crispy fries with truffle oil' },
          { name: 'Chocolate Milkshake', price: 6.99, category: 'Drinks', description: 'Thick homemade milkshake' },
        ],
      },
    },
  });

  const nyPizza = await prisma.restaurant.create({
    data: {
      name: 'NY Pizza Co',
      cuisine: 'Italian-American',
      address: 'Brooklyn, New York, NY',
      country: 'AMERICA',
      menuItems: {
        create: [
          { name: 'Margherita Pizza', price: 14.99, category: 'Pizza', description: 'Fresh basil and mozzarella' },
          { name: 'Pepperoni Pizza', price: 17.99, category: 'Pizza', description: 'Classic NY-style pepperoni' },
          { name: 'Caesar Salad', price: 9.99, category: 'Salads', description: 'Romaine with caesar dressing' },
          { name: 'Garlic Knots', price: 5.99, category: 'Sides', description: 'Soft garlic-buttered knots' },
        ],
      },
    },
  });

  // Seed Payment Methods for Admin India
  await prisma.paymentMethod.createMany({
    data: [
      { type: 'CARD', details: '****4242', isDefault: true, country: 'INDIA', userId: adminIndia.id },
      { type: 'UPI', details: 'arjun@paytm', isDefault: false, country: 'INDIA', userId: adminIndia.id },
    ],
  });

  // Seed Payment Method for Admin America
  await prisma.paymentMethod.create({
    data: { type: 'CARD', details: '****1234', isDefault: true, country: 'AMERICA', userId: adminAmerica.id },
  });

  console.log('✅ Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
