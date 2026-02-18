# LMS Backend (Bun + TypeScript + Express)

## Features
- MVC architecture with class-based controllers
- JWT bearer authentication middleware
- User auth with OTP verification and password recovery
- Separate admin module (separate collection) with role-based CRUD
- Separate client/admin app instances and ports
- Swagger UI docs for user and admin APIs
- Professional layered structure (`apps`, `modules`, `shared`)

## Setup
1. Install dependencies:
   - `bun install`
2. Copy env file:
   - `cp .env.example .env`
3. Run APIs:
   - Client only: `bun run dev:client`
   - Admin only: `bun run dev:admin`
   - Both: `bun run dev`

## Env Keys
- `CLIENT_PORT` default `5001`
- `ADMIN_PORT` default `5002`
- `MONGODB_URI`, `JWT_SECRET`, mail settings, OTP settings

## Folder Structure
```text
src/
  apps/
    client/   # client express app + client server entry
    admin/    # admin express app + admin server entry
  modules/
    auth/     # auth domain (controller, route, service, model, types)
    admin/    # admin domain (controller, route, service, model, types, role auth)
  shared/
    config/   # env + db
    constants/
    docs/     # swagger specs
    middlewares/
    services/ # shared services (jwt, mail)
    types/    # express global types
    utils/
  scripts/    # seed/init scripts
  server.ts   # optional combined runner (starts both apps)
```

## API Docs
- User/Auth docs: `http://localhost:5001/docs`
- Admin docs: `http://localhost:5002/docs` (alias: `/admin/docs`)
- Extended admin guide: `ADMIN_ROUTES.md`

## Main Routes

### User API (client process)
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/social-login` (`provider`: `google|apple`)
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/profile`

### Admin API (admin process)
- `POST /api/v1/admin-auth/bootstrap-superadmin`
- `POST /api/v1/admin-auth/login`
- `GET /api/v1/admin-auth/profile`
- `POST /api/v1/admins`
- `GET /api/v1/admins`
- `GET /api/v1/admins/:id`
- `PATCH /api/v1/admins/:id`
- `DELETE /api/v1/admins/:id`
