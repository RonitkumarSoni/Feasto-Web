# FEASTO Backend PRD (Startup Grade)

## Vision

Build a production-grade food delivery backend similar to Swiggy using a modular monolith architecture that can later be migrated to microservices without breaking API contracts.

---

# Core Technology Stack

## Runtime
- Node.js LTS

## Language
- TypeScript

## Framework
- Express.js

## Database
- PostgreSQL

## ORM
- Prisma ORM

## Authentication
- JWT Access Token
- Refresh Token
- HTTP Only Cookies

## Cache
- Redis

## Realtime
- Socket.IO

## Background Jobs
- BullMQ

## File Storage
- Cloudinary

## Payments
- Razorpay

## Maps & Location
- Google Maps API

## Validation
- Zod

## Logging
- Pino

## Monitoring
- Sentry

## API Documentation
- Swagger / OpenAPI

## Containerization
- Docker

## CI/CD
- GitHub Actions

---

# Architecture

Current Architecture:

Modular Monolith

Future Architecture:

- API Gateway
- Auth Service
- Order Service
- Payment Service
- Delivery Service
- Notification Service

Code should be organized so modules can be extracted later.

---

# Folder Structure

src/

modules/
- auth
- users
- restaurants
- foods
- carts
- orders
- payments
- delivery
- reviews
- coupons
- notifications
- admin

Each module:

- routes
- controller
- service
- repository
- dto
- validator
- types

shared/

- middleware
- utils
- constants
- config
- logger

---

# Authentication System

## Login Methods

### Email Password

- Register
- Verify Email
- Login
- Logout

### OTP Authentication

- Phone OTP
- Email OTP

### Future

- Google OAuth

---

## Access Token

JWT

Expiry:

15 Minutes

Payload:

- userId
- role
- permissions

---

## Refresh Token

Expiry:

30 Days

Storage:

- Database
- HTTP Only Cookie

Refresh token rotation mandatory.

---

## Password Security

bcrypt

Cost Factor:

12

Rules:

- Minimum 8 characters
- Uppercase
- Lowercase
- Number
- Special Character

---

# Authorization

RBAC

Roles:

- CUSTOMER
- RESTAURANT_OWNER
- DELIVERY_PARTNER
- ADMIN

Permission based middleware required.

---

# User Module

Features:

- Update Profile
- Upload Avatar
- Manage Addresses
- Order History
- Saved Restaurants

---

# Restaurant Module

Features:

- Create Restaurant
- Update Restaurant
- Delete Restaurant
- Upload Logo
- Upload Banner
- Operating Hours
- Delivery Radius

Approval required by Admin.

---

# Food Module

Features:

- Add Food
- Update Food
- Delete Food
- Variants
- Addons
- Categories
- Availability

---

# Cart Module

Features:

- Add Item
- Remove Item
- Quantity Update
- Coupon Apply
- Tax Calculation

---

# Order Module

Order States:

- PENDING
- ACCEPTED
- PREPARING
- READY_FOR_PICKUP
- PICKED_UP
- ON_THE_WAY
- DELIVERED
- CANCELLED

Features:

- Create Order
- Cancel Order
- Reorder
- Track Order

---

# Delivery Module

Features:

- Auto Assignment
- Accept Delivery
- Reject Delivery
- Live Tracking
- Earnings

---

# Payment Module

Phase 1

- Cash On Delivery

Phase 2

- Razorpay

Features:

- Payment Verification
- Refunds
- Webhooks
- Transaction Logs

---

# Notification Module

Channels:

- Realtime
- Email

Future:

- Push Notifications

Events:

- Order Created
- Order Accepted
- Order Delivered

---

# Realtime Requirements

Socket.IO

Namespaces:

- customer
- restaurant
- delivery
- admin

Events:

- order-created
- order-accepted
- order-preparing
- order-picked-up
- order-delivered
- location-update

---

# Database Design

## Core Tables

users

roles

refresh_tokens

otp_verifications

addresses

restaurants

restaurant_images

restaurant_categories

foods

food_images

food_variants

food_addons

carts

cart_items

orders

order_items

payments

refunds

delivery_partners

deliveries

delivery_locations

reviews

coupons

coupon_usage

notifications

audit_logs

support_tickets

system_settings

---

# Redis Usage

- Session Cache
- OTP Storage
- Restaurant Cache
- Menu Cache
- Rate Limiting
- Search Cache

---

# Queue System (BullMQ)

Jobs:

- Email Sending
- Notification Delivery
- Refund Processing
- Analytics Processing

---

# Security

Helmet

Rate Limiting

CORS

Input Sanitization

XSS Protection

CSRF Protection

Zod Validation

Audit Logging

---

# Logging

Pino Logger

Track:

- Requests
- Errors
- Payments
- Authentication
- Order Lifecycle

---

# Monitoring

Sentry

Track:

- Exceptions
- Performance Issues
- Failed Requests

---

# API Standards

Base URL

/api/v1

Response Format

{
  success: boolean,
  message: string,
  data: object,
  error: object
}

Pagination Required

Filtering Required

Sorting Required

Search Required

---

# Deployment

Backend

- Docker
- VPS / AWS

Database

- PostgreSQL

Cache

- Redis

Storage

- Cloudinary

---

# Future Microservices Migration

Phase 1

Modular Monolith

Phase 2

Extract:

- Auth
- Orders
- Notifications

Phase 3

Extract:

- Payments
- Delivery

Frontend must continue working without API changes.
