import { app } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Swagger docs on http://localhost:${env.port}/docs`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void bootstrap();
