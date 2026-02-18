import { HTTP_STATUS } from "../../../shared/constants/httpStatus";
import { ADMIN_ROLES, Admin, AdminRole, IAdmin } from "../models/admin.model";
import { AppError } from "../../../shared/utils/appError";
import { signAdminToken } from "../../../shared/services/token.service";
import { CreateAdminInput, UpdateAdminInput } from "../types/admin.types";

const adminPublic = (admin: IAdmin) => ({
  id: admin.id,
  fullName: admin.fullName,
  email: admin.email,
  role: admin.role,
  isActive: admin.isActive,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});

export class AdminService {
  public async login(input: { email: string; password: string }) {
    const admin = await Admin.findOne({ email: input.email.toLowerCase() });
    if (!admin) {
      throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
    }

    const isValidPassword = await admin.comparePassword(input.password);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
    }

    if (!admin.isActive) {
      throw new AppError("Admin account is inactive", HTTP_STATUS.FORBIDDEN);
    }

    const token = signAdminToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      message: "Admin login successful",
      token,
      admin: adminPublic(admin),
    };
  }

  public async bootstrapSuperadmin(input: {
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
  }) {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      throw new AppError("Bootstrap disabled. Admin already exists.", HTTP_STATUS.FORBIDDEN);
    }

    const admin = await Admin.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      password: input.password,
      role: "superadmin",
      isActive: input.isActive ?? true,
    });

    return {
      message: "Superadmin created successfully",
      admin: adminPublic(admin),
    };
  }

  public async createAdmin(input: CreateAdminInput, actorRole: AdminRole) {
    if (actorRole !== ADMIN_ROLES.SUPERADMIN && input.role === ADMIN_ROLES.SUPERADMIN) {
      throw new AppError("Only superadmin can create another superadmin", HTTP_STATUS.FORBIDDEN);
    }

    const existingAdmin = await Admin.findOne({ email: input.email.toLowerCase() });
    if (existingAdmin) {
      throw new AppError("Admin email already exists", HTTP_STATUS.CONFLICT);
    }

    const admin = await Admin.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      password: input.password,
      role: input.role,
      isActive: input.isActive ?? true,
    });

    return {
      message: "Admin created successfully",
      admin: adminPublic(admin),
    };
  }

  public async listAdmins() {
    const admins = await Admin.find().sort({ createdAt: -1 });
    return {
      admins: admins.map((admin) => adminPublic(admin)),
    };
  }

  public async getAdminById(adminId: string) {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
    }

    return {
      admin: adminPublic(admin),
    };
  }

  public async updateAdmin(adminId: string, input: UpdateAdminInput, actorRole: AdminRole) {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
    }

    if (actorRole !== ADMIN_ROLES.SUPERADMIN && admin.role === ADMIN_ROLES.SUPERADMIN) {
      throw new AppError("Only superadmin can update superadmin", HTTP_STATUS.FORBIDDEN);
    }

    if (actorRole !== ADMIN_ROLES.SUPERADMIN && input.role === ADMIN_ROLES.SUPERADMIN) {
      throw new AppError("Only superadmin can promote to superadmin", HTTP_STATUS.FORBIDDEN);
    }

    if (input.email && input.email.toLowerCase() !== admin.email) {
      const existingAdmin = await Admin.findOne({ email: input.email.toLowerCase() });
      if (existingAdmin) {
        throw new AppError("Admin email already exists", HTTP_STATUS.CONFLICT);
      }
      admin.email = input.email.toLowerCase();
    }

    if (input.fullName !== undefined) admin.fullName = input.fullName;
    if (input.password !== undefined) admin.password = input.password;
    if (input.role !== undefined) admin.role = input.role;
    if (input.isActive !== undefined) admin.isActive = input.isActive;

    await admin.save();

    return {
      message: "Admin updated successfully",
      admin: adminPublic(admin),
    };
  }

  public async deleteAdmin(adminId: string, currentAdminId: string) {
    if (adminId === currentAdminId) {
      throw new AppError("You cannot delete your own admin account", HTTP_STATUS.BAD_REQUEST);
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);
    }

    await admin.deleteOne();

    return {
      message: "Admin deleted successfully",
    };
  }
}
