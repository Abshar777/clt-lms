import mongoose, { Document, Model, Schema } from "mongoose";

export const OTP_PURPOSE = {
  VERIFY_EMAIL: "VERIFY_EMAIL",
  RESET_PASSWORD: "RESET_PASSWORD",
} as const;

export type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

export interface IOtp extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: Object.values(OTP_PURPOSE),
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1, purpose: 1 });

export const Otp: Model<IOtp> = mongoose.model<IOtp>("Otp", otpSchema);
