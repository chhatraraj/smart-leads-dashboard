import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, IUser } from "../models/User.model";
import { RefreshToken } from "../models/RefreshToken.model";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

// Helper: ms string → Date (e.g. "7d" → 7 days from now)
const msToDate = (duration: string): Date => {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration: ${duration}`);
  return new Date(Date.now() + parseInt(match[1]) * units[match[2]]);
};

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Signs access + refresh tokens and persists refresh token in DB
const generateTokenPair = async (user: IUser): Promise<TokenPair> => {
  const accessToken = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES as any }
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: msToDate(env.JWT_REFRESH_EXPIRES),
  });

  return { accessToken, refreshToken };
};

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: IUser; tokens: TokenPair }> {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new AppError("Email already in use", 409);

    // Force role to sales_user to prevent privilege escalation
    const user = await User.create({ ...data, role: "sales_user" });
    const tokens = await generateTokenPair(user);
    return { user, tokens };
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; tokens: TokenPair }> {
    // Must select password explicitly since we set select:false
    const user = await User.findOne({ email: data.email }).select("+password");
    if (!user) throw new AppError("Invalid email or password", 401);

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) throw new AppError("Invalid email or password", 401);

    const tokens = await generateTokenPair(user);
    return { user, tokens };
  },

  async refresh(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    const stored = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false,
    }).populate<{ user: IUser }>("user");

    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = stored.user as IUser;
    const accessToken = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES as any }
    );

    return { accessToken };
  },

  async logout(refreshToken: string): Promise<void> {
    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { isRevoked: true }
    );
  },
};