import { app as clientApp } from "./apps/client/app";
import { app as adminApp } from "./apps/admin/app";
import { connectDB } from "./shared/config/db";
import { env } from "./shared/config/env";

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();

    clientApp.listen(env.clientPort, () => {
      console.log(`Client API running on http://localhost:${env.clientPort}`);
      console.log(`Client docs on http://localhost:${env.clientPort}/docs`);
    });

    adminApp.listen(env.adminPort, () => {
      console.log(`Admin API running on http://localhost:${env.adminPort}`);
      console.log(`Admin docs on http://localhost:${env.adminPort}/docs (alias: /admin/docs)`);
    });
  } catch (error) {
    console.error("Failed to start servers", error);
    process.exit(1);
  }
};

void bootstrap();
