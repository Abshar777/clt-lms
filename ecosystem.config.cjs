module.exports = {
  apps: [
    {
      name: "lms-client-api",
      script: "src/apps/client/server.ts",
      interpreter: "bun",
      cwd: ".",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        CLIENT_PORT: "5001",
      },
    },
    {
      name: "lms-admin-api",
      script: "src/apps/admin/server.ts",
      interpreter: "bun",
      cwd: ".",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        ADMIN_PORT: "5002",
      },
    },
  ],
};
