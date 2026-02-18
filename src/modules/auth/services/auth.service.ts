import { env } from "../../../shared/config/env";
import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { OTP_PURPOSE, Otp, OtpPurpose } from "../models/otp.model";
import { AUTH_PROVIDER, User } from "../models/user.model";
import { genrateTemplateHtml } from "../templates/otp.template";
import { AppError } from "../../../shared/utils/appError";
import { generateOtp } from "../../../shared/utils/generateOtp";
import { compareValue, hashValue } from "../../../shared/utils/hash";
import { sendEmail } from "../../../shared/services/mail.service";
import { signToken } from "../../../shared/services/token.service";

export class AuthService {
  private async issueOtp(params: {
    userId: string;
    email: string;
    purpose: OtpPurpose;
  }): Promise<string> {
    const plainOtp = generateOtp();
    const codeHash = await hashValue(plainOtp);
    const expiresAt = new Date(Date.now() + env.otpExpMinutes * 60 * 1000);

    await Otp.deleteMany({ email: params.email, purpose: params.purpose });

    await Otp.create({
      user: params.userId,
      email: params.email,
      purpose: params.purpose,
      codeHash,
      expiresAt,
    });

    return plainOtp;
  }

  private async verifyAndConsumeOtp(params: {
    email: string;
    otp: string;
    purpose: OtpPurpose;
  }): Promise<void> {
    const otpDoc = await Otp.findOne({
      email: params.email,
      purpose: params.purpose,
    }).sort({ createdAt: -1 });

    if (!otpDoc) {
      throw new AppError("OTP not found. Please request a new OTP.", HTTP_STATUS.BAD_REQUEST);
    }

    if (otpDoc.expiresAt.getTime() < Date.now()) {
      await Otp.deleteMany({ email: params.email, purpose: params.purpose });
      throw new AppError("OTP expired", HTTP_STATUS.BAD_REQUEST);
    }

    const isOtpValid = await compareValue(params.otp, otpDoc.codeHash);
    if (!isOtpValid) {
      throw new AppError("Invalid OTP", HTTP_STATUS.BAD_REQUEST);
    }

    await Otp.deleteMany({ email: params.email, purpose: params.purpose });
  }

  public async signup(input: { fullName: string; country: string; email: string; password: string }) {
    const normalizedEmail = input.email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.authProvider !== AUTH_PROVIDER.LOCAL) {
      throw new AppError(
        `This email is registered with ${existingUser.authProvider}. Please use social login.`,
        HTTP_STATUS.CONFLICT,
      );
    }

    if (existingUser && existingUser.isEmailVerified) {
      throw new AppError("Email already registered", HTTP_STATUS.CONFLICT);
    }

    const user =
      existingUser ??
      new User({
        fullName: input.fullName,
        country: input.country,
        email: normalizedEmail,
        password: input.password,
      });

    user.fullName = input.fullName;
    user.country = input.country;
    user.email = normalizedEmail;
    user.password = input.password;
    user.authProvider = AUTH_PROVIDER.LOCAL;
    user.providerUserId = undefined;
    user.isEmailVerified = false;

    await user.save();

    const otpCode = await this.issueOtp({
      userId: user.id,
      email: user.email,
      purpose: OTP_PURPOSE.VERIFY_EMAIL,
    });

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
    const normalizedEmail = input.email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }
    if (user.authProvider !== AUTH_PROVIDER.LOCAL) {
      throw new AppError("Social accounts do not require OTP verification", HTTP_STATUS.BAD_REQUEST);
    }

    await this.verifyAndConsumeOtp({
      email: normalizedEmail,
      otp: input.otp,
      purpose: OTP_PURPOSE.VERIFY_EMAIL,
    });

    user.isEmailVerified = true;

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
        authProvider: user.authProvider,
      },
    };
  }

  public async resendOtp(input: { email: string }) {
    const normalizedEmail = input.email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }
    if (user.authProvider !== AUTH_PROVIDER.LOCAL) {
      throw new AppError("Social accounts do not support resend OTP", HTTP_STATUS.BAD_REQUEST);
    }

    const otpCode = await this.issueOtp({
      userId: user.id,
      email: user.email,
      purpose: OTP_PURPOSE.VERIFY_EMAIL,
    });

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
    if (user.authProvider !== AUTH_PROVIDER.LOCAL) {
      throw new AppError(
        `Use ${user.authProvider} login for this account. Email/password login is disabled.`,
        HTTP_STATUS.FORBIDDEN,
      );
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
        authProvider: user.authProvider,
      },
    };
  }

  public async socialLogin(input: {
    provider: "google" | "apple";
    providerUserId: string;
    email: string;
    fullName: string;
    country?: string;
  }) {
    const normalizedEmail = input.email.toLowerCase();
    const defaultCountry = input.country ?? "Unknown";
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const syntheticPassword = `${generateOtp()}${Date.now()}${input.provider}`;
      user = await User.create({
        fullName: input.fullName,
        country: defaultCountry,
        email: normalizedEmail,
        password: syntheticPassword,
        authProvider: input.provider,
        providerUserId: input.providerUserId,
        isEmailVerified: true,
      });
    } else {
      if (user.authProvider === AUTH_PROVIDER.LOCAL) {
        throw new AppError(
          "This email is registered with email/password. Please login using email and password.",
          HTTP_STATUS.CONFLICT,
        );
      }

      if (user.authProvider !== input.provider) {
        throw new AppError(
          `This account is linked with ${user.authProvider}. Please continue with ${user.authProvider}.`,
          HTTP_STATUS.FORBIDDEN,
        );
      }

      if (user.providerUserId && user.providerUserId !== input.providerUserId) {
        throw new AppError("Invalid social account identifier", HTTP_STATUS.FORBIDDEN);
      }

      user.fullName = input.fullName;
      user.country = input.country ?? user.country;
      user.providerUserId = input.providerUserId;
      user.isEmailVerified = true;
      await user.save();
    }

    const token = signToken({ userId: user.id, email: user.email });

    return {
      message: `${input.provider} login successful`,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        country: user.country,
        email: user.email,
        authProvider: user.authProvider,
      },
    };
  }

  public async forgotPassword(input: { email: string }) {
    const normalizedEmail = input.email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return {
        message: "If the email exists, an OTP has been sent.",
      };
    }
    if (user.authProvider !== AUTH_PROVIDER.LOCAL) {
      throw new AppError(
        `Password reset is unavailable for ${user.authProvider} accounts. Use social login.`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const otpCode = await this.issueOtp({
      userId: user.id,
      email: user.email,
      purpose: OTP_PURPOSE.RESET_PASSWORD,
    });

    await sendEmail(
      user.email,
      "Reset your password - OTP",
      genrateTemplateHtml(user.fullName, otpCode),
    );

    return {
      message: "If the email exists, an OTP has been sent.",
    };
  }

  public async resetPassword(input: { email: string; otp: string; newPassword: string }) {
    const normalizedEmail = input.email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
    }
    if (user.authProvider !== AUTH_PROVIDER.LOCAL) {
      throw new AppError(
        `Password reset is unavailable for ${user.authProvider} accounts. Use social login.`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    await this.verifyAndConsumeOtp({
      email: normalizedEmail,
      otp: input.otp,
      purpose: OTP_PURPOSE.RESET_PASSWORD,
    });

    user.password = input.newPassword;

    await user.save();

    return {
      message: "Password reset successful",
    };
  }
}
