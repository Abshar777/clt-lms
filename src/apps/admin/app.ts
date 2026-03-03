import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import adminRoutes from "../../modules/admin/routes/admin.routes";
import { adminSwaggerSpec } from "../../shared/docs/swagger";
import { errorMiddleware } from "../../shared/middlewares/error.middleware";
import { allowedOrigins } from "../../shared/constants/httpStatus";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        console.log(origin, "origin when cors is used");
        callback(null, origin);
      } else {
        console.log(origin, allowedOrigins, "origin when cors is not used");
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// -------------------- cors options middleware-------------------------------
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204);
  } else {
    res.status(403).send("CORS Preflight Request Not Allowed");
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "LMS admin backend is healthy" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(adminSwaggerSpec));
app.use("/admin/docs", swaggerUi.serve, swaggerUi.setup(adminSwaggerSpec));
app.use("/api/v1", adminRoutes);

app.use(errorMiddleware);
