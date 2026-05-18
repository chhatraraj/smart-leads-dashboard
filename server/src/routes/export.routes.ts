import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { leadsService } from "../services/leads.service";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/leads/csv",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, isAdmin } = {
      userId:  req.user!._id.toString(),
      isAdmin: req.user!.role === "admin",
    };

    const leads = await leadsService.getAllForExport(req.query as any, userId, isAdmin);

    const headers = ["ID", "Name", "Email", "Status", "Source", "Created By", "Created At"];
    const rows = leads.map((l) => [
      l._id.toString(),
      l.name,
      l.email,
      l.status,
      l.source,
      (l.createdBy as any)?.name ?? "",
      l.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="leads-${Date.now()}.csv"`);
    res.send(csv);
  })
);

export default router;