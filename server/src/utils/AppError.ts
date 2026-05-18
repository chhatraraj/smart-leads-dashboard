export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // means we threw this intentionally

    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}