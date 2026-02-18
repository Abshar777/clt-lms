import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const rootDir = process.cwd();
const authRoutesGlob = path.join(rootDir, "src/modules/auth/routes/*.ts");
const adminRoutesGlob = path.join(rootDir, "src/modules/admin/routes/*.ts");

const baseDefinition = {
  openapi: "3.0.3",
  servers: [
    {
      url: "http://localhost:5001",
      description: "Local dev server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Paste JWT token as: Bearer <token>",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Invalid OTP",
          },
        },
      },
    },
  },
} as const;

export const userSwaggerSpec = swaggerJsdoc({
  definition: {
    ...baseDefinition,
    servers: [
      {
        url: "http://localhost:5001",
        description: "Client API server",
      },
    ],
    info: {
      title: "LMS User Auth API",
      version: "1.0.0",
      description: "User authentication, OTP verification, and password recovery APIs.",
    },
  },
  apis: [authRoutesGlob],
});

export const adminSwaggerSpec = swaggerJsdoc({
  definition: {
    ...baseDefinition,
    servers: [
      {
        url: "http://localhost:5002",
        description: "Admin API server",
      },
    ],
    info: {
      title: "LMS Admin API",
      version: "1.0.0",
      description: "Admin authentication and admin CRUD APIs (separate admin collection).",
    },
  },
  apis: [adminRoutesGlob],
});
