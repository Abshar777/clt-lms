# LMS Backend (Bun + TypeScript + Express)

## Features
- MVC architecture with class-based controllers
- JWT bearer authentication middleware
- Signup/Login
- Email OTP verification
- Forgot password + reset password
- Swagger UI docs

## Setup
1. Install dependencies:
   - `bun install`
2. Copy env file:
   - `cp .env.example .env`
3. Run server:
   - `bun run dev`

## API Docs
- Swagger UI: `http://localhost:5001/api-docs`

## Routes (Auth)
- `POST /api/v1/auth/signup`
  - body: `fullName`, `country`, `email`, `password`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/profile` (Bearer token required)
