import mongoose, { Document, Model, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/hash";

export interface IUser extends Document {
  fullName: string;
  country: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  otpCode?: string;
  otpExpiresAt?: Date;
  resetPasswordCode?: string;
  resetPasswordExpiresAt?: Date;
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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    resetPasswordCode: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
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
