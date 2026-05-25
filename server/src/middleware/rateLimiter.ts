import rateLimit from "express-rate-limit";

// Limits login attempts — prevents brute force attacks
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10,                  // max 10 attempts per window
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,  // sends RateLimit headers in response with limit and remaining requests
  legacyHeaders: false,
});