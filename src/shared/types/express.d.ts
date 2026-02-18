import { IAdmin } from "../../modules/admin/models/admin.model";
import { IUser } from "../../modules/auth/models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      admin?: IAdmin;
    }
  }
}

export {};
