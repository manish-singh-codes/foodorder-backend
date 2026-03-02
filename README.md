# 🍽️ FoodOrder — Backend

> NestJS · GraphQL · Prisma · PostgreSQL · JWT RBAC + Re-BAC

A role-based food ordering backend built with NestJS and GraphQL, supporting three user roles (Admin, Manager, Member) with country-level access restrictions.

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Mock data seeder
├── src/
│   ├── auth/                # JWT auth, login, register
│   │   ├── dto/
│   │   │   ├── auth.response.ts
│   │   │   ├── login.input.ts
│   │   │   └── register.input.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.module.ts
│   │   ├── auth.resolver.ts
│   │   └── auth.service.ts
│   ├── common/              # Guards, decorators, enums
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── enums/
│   │   │   ├── country.enum.ts
│   │   │   └── role.enum.ts
│   │   └── guards/
│   │       ├── country-scope.guard.ts
│   │       ├── jwt-auth.guard.ts
│   │       └── roles.guard.ts
│   ├── menu-items/          # Menu item queries
│   ├── orders/              # Order CRUD + checkout + cancel
│   ├── payment-methods/     # Payment method management
│   ├── prisma/              # Prisma service & module
│   ├── restaurants/         # Restaurant queries
│   ├── users/               # User queries (Admin only)
│   ├── app.module.ts
│   └── main.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://npmjs.com/) v9+
- [PostgreSQL](https://www.postgresql.org/) v14+

---

## 🚀 Setup & Installation

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/food-order-app.git
cd food-order-app/backend
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment variables

Create a `.env` file in the `backend/` root:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/food_ordering"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# App
PORT=3001
```

> Replace `your_password` with your actual PostgreSQL password.

### Step 4 — Set up the database

Run Prisma migrations to create all tables:

```bash
npx prisma migrate dev --name init
```

### Step 5 — Seed mock data

Populate the database with restaurants, menu items, and test users:

```bash
npx prisma db seed
```

This creates the following test accounts:

| Email | Password | Role | Country |
|---|---|---|---|
| `admin.india@food.com` | `password123` | ADMIN | INDIA |
| `manager.india@food.com` | `password123` | MANAGER | INDIA |
| `member.india@food.com` | `password123` | MEMBER | INDIA |
| `admin.america@food.com` | `password123` | ADMIN | AMERICA |

### Step 6 — Start the development server

```bash
npm run start:dev
```

The GraphQL API will be available at:
- **API:** `http://localhost:3001/graphql`
- **Playground:** `http://localhost:3001/graphql` (Apollo Sandbox)

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain a token via the `login` mutation:

```graphql
mutation {
  login(input: { email: "admin.india@food.com", password: "password123" }) {
    accessToken
    user {
      id
      name
      role
      country
    }
  }
}
```

---

## 📊 Role & Permission Matrix

| Feature | Admin | Manager | Member |
|---|:---:|:---:|:---:|
| View restaurants & menu | ✅ | ✅ | ✅ |
| Create an order | ✅ | ✅ | ✅ |
| Checkout & pay | ✅ | ✅ | ❌ |
| Cancel an order | ✅ | ✅ | ❌ |
| Add/modify payment methods | ✅ | ❌ | ❌ |
| View all orders (country) | ✅ | ❌ | ❌ |

---

## 🌍 Re-BAC Country Restrictions

Every user is assigned a country (`INDIA` or `AMERICA`). The system enforces:

- Restaurants are automatically scoped to the user's country
- Orders can only be placed at restaurants within the user's country
- Payment methods are country-specific
- `CountryScopeGuard` blocks cross-country operations at the API level

---

## 📡 GraphQL Operations Reference

### Auth
```graphql
mutation Register($input: RegisterInput!)
mutation Login($input: LoginInput!)
query Me
```

### Restaurants
```graphql
query GetRestaurants          # scoped to user country
query GetRestaurant($id: ID!)
query GetMenuItems($restaurantId: ID!)
```

### Orders
```graphql
mutation CreateOrder($input: CreateOrderInput!)
mutation CheckoutOrder($input: CheckoutOrderInput!)  # Admin, Manager
mutation CancelOrder($orderId: ID!)                  # Admin, Manager
query MyOrders
query AllOrders                                      # Admin only
```

### Payment Methods
```graphql
mutation AddPaymentMethod($input: CreatePaymentMethodInput!)    # Admin
mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) # Admin
mutation DeletePaymentMethod($id: ID!)                          # Admin
query MyPaymentMethods
```

---

## 🛠️ Available Scripts

```bash
npm run start:dev       # Start in watch/dev mode
npm run start:prod      # Start in production mode
npm run build           # Compile TypeScript
npm run lint            # Run ESLint
npm run test            # Run unit tests
npx prisma studio       # Open Prisma GUI
npx prisma migrate dev  # Run new migrations
npx prisma db seed      # Re-seed database
```

---

## 📦 Tech Stack

| Tool | Purpose |
|---|---|
| NestJS | Backend framework |
| GraphQL + Apollo | API layer |
| Prisma | ORM & migrations |
| PostgreSQL | Database |
| JWT + Passport | Authentication |
| class-validator | Input validation |
| bcryptjs | Password hashing |
