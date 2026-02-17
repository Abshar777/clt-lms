import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthService } from "../services/auth.service";
import {
  ForgotPasswordInput,
  LoginInput,
  ResendOtpInput,
  ResetPasswordInput,
  SignupInput,
  VerifyOtpInput,
} from "../types/auth.types";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public signup = async (req: Request<{}, {}, SignupInput>, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.signup(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  public verifyOtp = async (
    req: Request<{}, {}, VerifyOtpInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.authService.verifyOtp(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public resendOtp = async (
    req: Request<{}, {}, ResendOtpInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.authService.resendOtp(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.authService.forgotPassword(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request<{}, {}, ResetPasswordInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.authService.resetPassword(req.body);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  };

  public profile = async (req: Request, res: Response): Promise<void> => {
    res.status(HTTP_STATUS.OK).json({
      user: {
        id: req.user?.id,
        fullName: req.user?.fullName,
        country: req.user?.country,
        email: req.user?.email,
        isEmailVerified: req.user?.isEmailVerified,
      },
    });
  };
}
