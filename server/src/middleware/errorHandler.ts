import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // 1. Handle known custom operational errors (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // 2. Mongoose duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] ?? "field";
    res.status(409).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
    return;
  }

  // 3. Mongoose validation schema error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
    return;
  }

  // 4. Unexpected/Unhandled system crashes
  console.error("💥 Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
};
