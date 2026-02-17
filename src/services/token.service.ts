import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (payload: { userId: string; email: string }): string => {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): { userId: string; email: string } => {
  return jwt.verify(token, env.jwtSecret) as { userId: string; email: string };
};
