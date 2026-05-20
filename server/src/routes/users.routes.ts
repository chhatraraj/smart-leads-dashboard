import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { User } from "../models/User.model";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/", asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, data: users });
}));

router.post("/", asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: string };
  if (!name || !email || !password) throw new AppError("Name, email and password are required", 400);
  // Prevent creating an admin unless explicitly provided and the caller is admin (middleware ensures admin)
  const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'sales_user' });
  res.status(201).json({ success: true, data: user });
}));

router.patch("/:id/role", asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id === req.user!._id.toString())
    throw new AppError("Cannot change your own role", 400);
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("-password");
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: user });
}));

router.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  if (req.params.id === req.user!._id.toString())
    throw new AppError("Cannot delete yourself", 400);
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
}));

export default router;