import { Request, Response } from "express";
import { leadsService, LeadFilters } from "../services/leads.service";
import { asyncHandler } from "../utils/asyncHandler";

const getCtx = (req: Request) => ({
  userId:  req.user!._id.toString(),
  isAdmin: req.user!.role === "admin",
});

const parseFilters = (q: any): LeadFilters => {
  const get = (v: any) => (Array.isArray(v) ? v[0] : v);
  const page = get(q.page);
  const limit = get(q.limit);
  const sort = get(q.sort);
  return {
    status: get(q.status),
    source: get(q.source),
    search: get(q.search),
    sort: sort === "oldest" ? "oldest" : "latest",
    page: page ? parseInt(String(page)) : 1,
    limit: limit ? parseInt(String(limit)) : 10,
  };
};

export const leadsController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { userId, isAdmin } = getCtx(req);
    const result = await leadsService.getAll(parseFilters(req.query), userId, isAdmin);
    res.json({ success: true, ...result });
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { userId, isAdmin } = getCtx(req);
    const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const lead = await leadsService.getOne(String(leadId), userId, isAdmin);
    res.json({ success: true, data: lead });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.create(req.body, getCtx(req).userId);
    res.status(201).json({ success: true, data: lead });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { userId, isAdmin } = getCtx(req);
    const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const lead = await leadsService.update(String(leadId), req.body, userId, isAdmin);
    res.json({ success: true, data: lead });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const leadId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await leadsService.delete(String(leadId));
    res.json({ success: true, message: "Lead deleted" });
  }),
};