import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";

const app: Application = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,           // allows cookies to be sent cross-origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check route — Docker and frontend use this
app.get("/api/health", async (_req: Request, res: Response) => {
  const dbState = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    db: dbState[require("mongoose").connection.readyState] ?? "unknown",
    uptime: Math.floor(process.uptime()),
    env: env.NODE_ENV,
  });
});

// 404 handler — catches any route not matched above
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — all errors flow here
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

export default app;