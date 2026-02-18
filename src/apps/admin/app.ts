import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import adminRoutes from "../../modules/admin/routes/admin.routes";
import { adminSwaggerSpec } from "../../shared/docs/swagger";
import { errorMiddleware } from "../../shared/middlewares/error.middleware";

export const app = express();

app.use(helmet());
app.use(cors());
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
