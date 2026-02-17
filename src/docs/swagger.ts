import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FUN FIN Backend API",
      version: "1.0.0",
      description:
        "Developer-friendly auth API for FUN FIN backend (Bun + TypeScript + Express).",
    },
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
  },
  apis: ["./src/routes/*.ts"],
});
