# Admin API Developer Guide

Base URL (local): `http://localhost:5002`
Docs UI: `http://localhost:5002/docs` (alias: `/admin/docs`)

## Auth Model
- Admin APIs use a separate admin collection/model.
- Use admin token from `POST /api/v1/admin-auth/login`.
- Header: `Authorization: Bearer <admin_jwt>`
- Roles:
  - `superadmin`
  - `admin`
  - `mentor`
  - `counsilor`

## Role Permissions
- `superadmin`
  - full CRUD on admins
  - only role that can delete admin
  - only role that can create/promote/update superadmin
- `admin`
  - create/list/get/update admins
  - cannot create/promote/update superadmin
- `mentor`, `counsilor`
  - can login and get own profile
  - no admin CRUD permission by default

## Endpoints

### 1) Bootstrap First Superadmin
`POST /api/v1/admin-auth/bootstrap-superadmin`

Use only once when no admin exists yet.

Request:
```json
{
  "fullName": "Root Admin",
  "email": "root@company.com",
  "password": "StrongPass123!",
  "isActive": true
}
```

Response 201:
```json
{
  "message": "Superadmin created successfully",
  "admin": {
    "id": "...",
    "fullName": "Root Admin",
    "email": "root@company.com",
    "role": "superadmin",
    "isActive": true
  }
}
```

### 2) Admin Login
`POST /api/v1/admin-auth/login`

Request:
```json
{
  "email": "root@company.com",
  "password": "StrongPass123!"
}
```

Response 200:
```json
{
  "message": "Admin login successful",
  "token": "<jwt>",
  "admin": {
    "id": "...",
    "fullName": "Root Admin",
    "email": "root@company.com",
    "role": "superadmin",
    "isActive": true
  }
}
```

### 3) Logged-in Admin Profile
`GET /api/v1/admin-auth/profile`

Auth: required

Response 200:
```json
{
  "admin": {
    "id": "...",
    "fullName": "Root Admin",
    "email": "root@company.com",
    "role": "superadmin",
    "isActive": true
  }
}
```

### 4) Create Admin (From Admin Side)
`POST /api/v1/admins`

Auth: `superadmin` or `admin`

Request:
```json
{
  "fullName": "Mentor One",
  "email": "mentor1@company.com",
  "password": "MentorPass123!",
  "role": "mentor",
  "isActive": true
}
```

Response 201:
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "...",
    "fullName": "Mentor One",
    "email": "mentor1@company.com",
    "role": "mentor",
    "isActive": true
  }
}
```

### 5) List Admins
`GET /api/v1/admins`

Auth: `superadmin` or `admin`

Response 200:
```json
{
  "admins": [
    {
      "id": "...",
      "fullName": "Root Admin",
      "email": "root@company.com",
      "role": "superadmin",
      "isActive": true
    }
  ]
}
```

### 6) Get Admin By Id
`GET /api/v1/admins/:id`

Auth: `superadmin` or `admin`

### 7) Update Admin
`PATCH /api/v1/admins/:id`

Auth: `superadmin` or `admin`

Request (partial):
```json
{
  "fullName": "Updated Name",
  "role": "counsilor",
  "isActive": false
}
```

Notes:
- non-superadmin cannot update superadmin
- non-superadmin cannot promote to superadmin

### 8) Delete Admin
`DELETE /api/v1/admins/:id`

Auth: `superadmin` only

Notes:
- cannot delete your own account

## Error Codes
- `400` validation/business rule error
- `401` unauthorized / invalid token
- `403` forbidden role / inactive admin
- `404` admin not found
- `409` duplicate admin email

## Process/Port Split
- Client API process: `bun run dev:client` -> `CLIENT_PORT` (default `5001`)
- Admin API process: `bun run dev:admin` -> `ADMIN_PORT` (default `5002`)
- Combined (both in one command): `bun run dev`
