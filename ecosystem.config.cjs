module.exports = {
  apps: [
    {
      name: "funfin",
      script: "src/server.ts",
      interpreter: "bun",
      cwd: ".",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
