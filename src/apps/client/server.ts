import { app as clientApp } from "./app";
import { connectDB } from "../../shared/config/db";
import { env } from "../../shared/config/env";

const bootstrapClient = async (): Promise<void> => {
  try {
    await connectDB();

    clientApp.listen(env.clientPort, () => {
      console.log(`Client API running on http://localhost:${env.clientPort}`);
      console.log(`Client docs on http://localhost:${env.clientPort}/docs`);
    });
  } catch (error) {
    console.error("Failed to start client server", error);
    process.exit(1);
  }
};

void bootstrapClient();
