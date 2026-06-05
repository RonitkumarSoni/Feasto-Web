# Feasto Server 🍔

This is the production-ready backend for the Feasto food delivery platform.

## Features

- **Authentication**: JWT with Refresh Tokens, Google/Apple OAuth, OTP (Email/Phone).
- **Users & Roles**: Role-Based Access Control (RBAC) for Customer, Restaurant Owner, Delivery Partner, and Admin.
- **Restaurant Management**: Profile, categories, items, variants, addons, operational hours.
- **Cart & Orders**: Complex pricing logic, tax calculations, coupons, discounts, minimum order value.
- **Payments**: Integration with Razorpay (stubbed), Cash on Delivery, Refunds.
- **Delivery**: Live tracking using Socket.IO, auto-assignment, partner earnings.
- **Background Jobs**: BullMQ and Redis for email sending, notifications, auto-cancellations.
- **Database**: PostgreSQL with Prisma ORM. 

## Setup Instructions

### 1. Prerequisites
- Node.js (v20+)
- PostgreSQL
- Redis
- Docker (optional)

### 2. Environment Variables
Create a `.env` file based on `.env.example`. 
```bash
npm install
```

### 3. Database
Generate the Prisma client and push the schema to your database.
```bash
npx prisma generate
npx prisma db push
```

### 4. Run Locally
```bash
npm run dev
```

### 5. Run with Docker
```bash
docker-compose up --build -d
```
