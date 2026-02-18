import dotenv from "dotenv";
import mongoose from "mongoose";
import { ADMIN_ROLES, Admin } from "../modules/admin/models/admin.model";

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

const normalizeRole = (role: string) => {
  const allowedRoles = Object.values(ADMIN_ROLES);
  if (!allowedRoles.includes(role as (typeof allowedRoles)[number])) {
    throw new Error(
      `Invalid DEFAULT_ADMIN_ROLE: ${role}. Allowed: ${allowedRoles.join(", ")}`,
    );
  }
  return role as (typeof allowedRoles)[number];
};

const run = async (): Promise<void> => {
  const mongoUri = requireEnv("MONGODB_URI");
  const email = requireEnv("DEFAULT_ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("DEFAULT_ADMIN_PASSWORD");
  const fullName = process.env.DEFAULT_ADMIN_FULLNAME ?? "Super Admin";
  const role = normalizeRole(process.env.DEFAULT_ADMIN_ROLE ?? ADMIN_ROLES.SUPERADMIN);

  await mongoose.connect(mongoUri);

  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    const created = await Admin.create({
      fullName,
      email,
      password,
      role,
      isActive: true,
    });

    console.log(`Created default admin: ${created.email} (${created.role})`);
  } else {
    existingAdmin.fullName = fullName;
    existingAdmin.password = password;
    existingAdmin.role = role;
    existingAdmin.isActive = true;
    await existingAdmin.save();

    console.log(`Updated default admin: ${existingAdmin.email} (${existingAdmin.role})`);
  }

  await mongoose.disconnect();
};

void run().catch(async (error) => {
  console.error("Default admin seed failed:", error instanceof Error ? error.message : error);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
