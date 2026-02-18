import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AdminRole } from "../../modules/admin/models/admin.model";

type BaseTokenPayload = {
  userId: string;
  email: string;
};

export type UserTokenPayload = BaseTokenPayload & {
  tokenType: "user";
};

export type AdminTokenPayload = BaseTokenPayload & {
  tokenType: "admin";
  role: AdminRole;
};

export type AppTokenPayload = UserTokenPayload | AdminTokenPayload;

const signJwt = (payload: AppTokenPayload): string => {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};

export const signToken = (payload: BaseTokenPayload): string => {
  return signJwt({
    ...payload,
    tokenType: "user",
  });
};

export const signAdminToken = (payload: BaseTokenPayload & { role: AdminRole }): string => {
  return signJwt({
    ...payload,
    tokenType: "admin",
  });
};

export const verifyToken = (token: string): AppTokenPayload => {
  return jwt.verify(token, env.jwtSecret) as AppTokenPayload;
};
