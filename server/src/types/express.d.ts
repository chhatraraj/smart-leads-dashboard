import { IUser } from "../models/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<IUser, "_id" | "name" | "email" | "role">;
    }
  }
}

export {};