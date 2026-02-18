import mongoose, { Document, Model, Schema } from "mongoose";
import { compareValue, hashValue } from "../../../shared/utils/hash";

export const AUTH_PROVIDER = {
  LOCAL: "local",
  GOOGLE: "google",
  APPLE: "apple",
} as const;

export type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

export interface IUser extends Document {
  fullName: string;
  country: string;
  email: string;
  password: string;
  authProvider: AuthProvider;
  providerUserId?: string;
  isEmailVerified: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
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
    authProvider: {
      type: String,
      enum: Object.values(AUTH_PROVIDER),
      default: AUTH_PROVIDER.LOCAL,
      required: true,
    },
    providerUserId: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  return next();
});

userSchema.methods.comparePassword = async function comparePassword(password: string): Promise<boolean> {
  return compareValue(password, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
