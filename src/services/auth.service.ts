import { env } from "../config/env";
import { HTTP_STATUS } from "../constants/httpStatus";
import { User } from "../models/user.model";
import { genrateTemplateHtml } from "../templates/otp.template";
import { AppError } from "../utils/appError";
import { generateOtp } from "../utils/generateOtp";
import { sendEmail } from "./mail.service";
import { signToken } from "./token.service";

export class AuthService {
  public async signup(input: { fullName: string; country: string; email: string; password: string }) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser && existingUser.isEmailVerified) {
      throw new AppError("Email already registered", HTTP_STATUS.CONFLICT);
    }

    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + env.otpExpMinutes * 60 * 1000);

    const user =
      existingUser ??
      new User({
        fullName: input.fullName,
        country: input.country,
        email: input.email.toLowerCase(),
        password: input.password,
      });

    user.fullName = input.fullName;
    user.country = input.country;
    user.email = input.email.toLowerCase();
    user.password = input.password;
    user.isEmailVerified = false;
    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;

    await user.save();

    await sendEmail(
      user.email,
      "Verify your email - OTP",
      genrateTemplateHtml(user.fullName, otpCode),
    );

    return {
      message: "Signup successful. OTP sent to your email.",
      email: user.email,
    };
  }

  public async verifyOtp(input: { email: string; otp: string }) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      throw new AppError("OTP not found. Please request a new OTP.", HTTP_STATUS.BAD_REQUEST);
    }

    if (user.otpCode !== input.otp) {
      throw new AppError("Invalid OTP", HTTP_STATUS.BAD_REQUEST);
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new AppError("OTP expired", HTTP_STATUS.BAD_REQUEST);
    }

    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    const token = signToken({ userId: user.id, email: user.email });

    return {
      message: "Email verified successfully.",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        country: user.country,
        email: user.email,
      },
    };
  }

  public async resendOtp(input: { email: string }) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    const otpCode = generateOtp();
    user.otpCode = otpCode;
    user.otpExpiresAt = new Date(Date.now() + env.otpExpMinutes * 60 * 1000);

    await user.save();

    await sendEmail(
      user.email,
      "Your new OTP code",
      genrateTemplateHtml(user.fullName, otpCode),
    );

    return {
      message: "New OTP sent successfully.",
    };
  }

  public async login(input: { email: string; password: string }) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isEmailVerified) {
      throw new AppError("Please verify your email first", HTTP_STATUS.FORBIDDEN);
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
    }

    const token = signToken({ userId: user.id, email: user.email });

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        country: user.country,
        email: user.email,
      },
    };
  }

  public async forgotPassword(input: { email: string }) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      return {
        message: "Mail Is Not Exist In Server ",
      };
    }

    const otpCode = generateOtp();
    user.resetPasswordCode = otpCode;
    user.resetPasswordExpiresAt = new Date(Date.now() + env.otpExpMinutes * 60 * 1000);

    await user.save();

    await sendEmail(
      user.email,
      "Reset your password - OTP",
      genrateTemplateHtml(user.fullName, otpCode),
    );

    return {
      message: "OTP has been sent.",
    };
  }

  public async resetPassword(input: { email: string; otp: string; newPassword: string }) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }

    if (!user.resetPasswordCode || !user.resetPasswordExpiresAt) {
      throw new AppError("Reset OTP not found", HTTP_STATUS.BAD_REQUEST);
    }

    if (user.resetPasswordCode !== input.otp) {
      throw new AppError("Invalid OTP", HTTP_STATUS.BAD_REQUEST);
    }

    if (user.resetPasswordExpiresAt.getTime() < Date.now()) {
      throw new AppError("OTP expired", HTTP_STATUS.BAD_REQUEST);
    }

    user.password = input.newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    return {
      message: "Password reset successful",
    };
  }
}
