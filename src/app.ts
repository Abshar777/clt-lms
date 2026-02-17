import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { swaggerSpec } from "./docs/swagger";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "LMS backend is healthy" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);
