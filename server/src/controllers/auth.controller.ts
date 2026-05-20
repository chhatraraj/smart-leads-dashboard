import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,      // JS cannot read this cookie
  secure: isProduction, // Evaluates to true on Render (HTTPS), false on localhost (HTTP)
  sameSite: isProduction ? ("none" as const) : ("lax" as const), // "none" is required across different domains
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.register(req.body);
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      data: { user, accessToken: tokens.accessToken },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await authService.login(req.body);
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      data: { user, accessToken: tokens.accessToken },
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: "Refresh token missing" });
      return;
    }
    const { accessToken } = await authService.refresh(refreshToken);
    res.status(200).json({ success: true, data: { accessToken } });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await authService.logout(refreshToken);
    
    // Pass COOKIE_OPTIONS to clearCookie to ensure identical matching attributes
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ success: true, data: { user: req.user } });
  }),
};
