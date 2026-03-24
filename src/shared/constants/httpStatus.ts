export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const allowedOrigins = [
  process.env.FRONTEND_URL as string,
  process.env.ADMIN_URL as string,
  "https://admin-funfin.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5001",
  "http://localhost:5002",
  "https://course.clt-academy.com",
  "https://api-fun-fin.clt-academy.com",
  "https://api-admin-fun-fin.clt-academy.com",
  "http://course1.clt-academy.com",
  "https://main.clt-academy.com",
];
