import { Router } from "express";
import { leadsController } from "../controllers/leads.controller";
import { requireAuth } from "../middleware/requireAuth";
import { requireRole } from "../middleware/requireRole";
import { validate } from "../validators/auth.schema";
import { createLeadSchema, updateLeadSchema, statusSchema } from "../validators/lead.schema";

const router = Router();

router.use(requireAuth); // all lead routes require auth

router.get(  "/",     leadsController.getAll);
router.get(  "/:id",  leadsController.getOne);
router.post( "/",     validate(createLeadSchema), leadsController.create);
router.put(  "/:id",  validate(updateLeadSchema), leadsController.update);
router.patch("/:id/status", validate(statusSchema), leadsController.update);
router.delete("/:id", requireRole("admin"),        leadsController.delete);

export default router;