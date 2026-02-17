import dotenv from "dotenv";

dotenv.config();

const requireEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5001),
  mongoUri: requireEnv("MONGODB_URI"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  mailHost: requireEnv("MAIL_HOST"),
  mailPort: Number(process.env.MAIL_PORT ?? 587),
  mailUser: requireEnv("MAIL_USER"),
  mailPass: requireEnv("MAIL_PASS"),
  mailFrom: process.env.MAIL_FROM ?? "CLT Academy <noreply@clt-academy.com>",
  otpExpMinutes: Number(process.env.OTP_EXP_MINUTES ?? 10),
};
