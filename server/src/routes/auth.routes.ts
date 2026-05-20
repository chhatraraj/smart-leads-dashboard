import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate, registerSchema, loginSchema } from "../validators/auth.schema";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;