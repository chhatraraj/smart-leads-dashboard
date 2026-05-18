import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/User.model";
import { AppError } from "../utils/AppError";

// Usage: requireRole("admin") or requireRole("admin", "sales_user")
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }
    if (!roles.includes(req.user.role as UserRole)) {
      throw new AppError(
        `Role '${req.user.role}' is not allowed to perform this action`,
        403
      );
    }
    next();
  };
};