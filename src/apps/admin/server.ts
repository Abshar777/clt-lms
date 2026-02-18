import { app as adminApp } from "./app";
import { connectDB } from "../../shared/config/db";
import { env } from "../../shared/config/env";

const bootstrapAdmin = async (): Promise<void> => {
  try {
    await connectDB();

    adminApp.listen(env.adminPort, () => {
      console.log(`Admin API running on http://localhost:${env.adminPort}`);
      console.log(`Admin docs on http://localhost:${env.adminPort}/docs (alias: /admin/docs)`);
    });
  } catch (error) {
    console.error("Failed to start admin server", error);
    process.exit(1);
  }
};

void bootstrapAdmin();
