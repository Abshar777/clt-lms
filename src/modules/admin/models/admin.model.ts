import mongoose, { Document, Model, Schema } from "mongoose";
import { compareValue, hashValue } from "../../../shared/utils/hash";

export const ADMIN_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MENTOR: "mentor",
  COUNSILOR: "counsilor",
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(ADMIN_ROLES),
      default: ADMIN_ROLES.ADMIN,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  return next();
});

adminSchema.methods.comparePassword = async function comparePassword(password: string): Promise<boolean> {
  return compareValue(password, this.password);
};

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);
