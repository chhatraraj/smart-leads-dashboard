import { Request, Response } from "express";
import { leadsService, LeadFilters } from "../services/leads.service";
import { asyncHandler } from "../utils/asyncHandler";

const getCtx = (req: Request) => ({
  userId:  req.user!._id.toString(),
  isAdmin: req.user!.role === "admin",
});

const parseFilters = (q: any): LeadFilters => ({
  status: q.status,
  source: q.source,
  search: q.search,
  sort:   q.sort === "oldest" ? "oldest" : "latest",
  page:   q.page  ? parseInt(q.page)  : 1,
  limit:  q.limit ? parseInt(q.limit) : 10,
});

export const leadsController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { userId, isAdmin } = getCtx(req);
    const result = await leadsService.getAll(parseFilters(req.query), userId, isAdmin);
    res.json({ success: true, ...result });
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { userId, isAdmin } = getCtx(req);
    const lead = await leadsService.getOne(req.params.id, userId, isAdmin);
    res.json({ success: true, data: lead });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.create(req.body, getCtx(req).userId);
    res.status(201).json({ success: true, data: lead });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { userId, isAdmin } = getCtx(req);
    const lead = await leadsService.update(req.params.id, req.body, userId, isAdmin);
    res.json({ success: true, data: lead });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await leadsService.delete(req.params.id);
    res.json({ success: true, message: "Lead deleted" });
  }),
};