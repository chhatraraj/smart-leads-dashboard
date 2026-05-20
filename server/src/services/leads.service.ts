import { Lead, ILead } from "../models/Lead.model";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: "latest" | "oldest";
  page?: number;
  limit?: number;
}

export interface PaginatedLeads {
  leads: ILead[];
  meta: { total: number; page: number; limit: number; pages: number };
}

const buildQuery = (
  filters: LeadFilters,
  userId?: string,
  isAdmin?: boolean
) => {
  const query: any = { isDeleted: false };

  // Sales users only see their own leads
  if (!isAdmin && userId) query.createdBy = new mongoose.Types.ObjectId(userId);

  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;

  // Search across name AND email
  if (filters.search) {
    query.$or = [
      { name:  { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  return query;
};

export const leadsService = {
  async getAll(
    filters: LeadFilters,
    userId: string,
    isAdmin: boolean
  ): Promise<PaginatedLeads> {
    const page  = Math.max(1, filters.page  ?? 1);
    const limit = Math.min(100, filters.limit ?? 10);
    const skip  = (page - 1) * limit;
    const sort  = filters.sort === "oldest" ? 1 : -1;

    const query = buildQuery(filters, userId, isAdmin);

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate("createdBy", "name email")
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(query),
    ]);

    return { leads, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  },

  async getOne(id: string, userId: string, isAdmin: boolean): Promise<ILead> {
    const lead = await Lead.findOne({ _id: id, isDeleted: false }).populate(
      "createdBy", "name email"
    );
    if (!lead) throw new AppError("Lead not found", 404);
    if (!isAdmin && lead.createdBy.toString() !== userId)
      throw new AppError("Not authorised", 403);
    return lead;
  },

  async create(data: Partial<ILead>, userId: string): Promise<ILead> {
    return Lead.create({ ...data, createdBy: userId });
  },

  async update(
    id: string,
    data: Partial<ILead>,
    userId: string,
    isAdmin: boolean
  ): Promise<ILead> {
    const lead = await this.getOne(id, userId, isAdmin);
    Object.assign(lead, data);
    return lead.save();
  },

  async delete(id: string): Promise<void> {
    const lead = await Lead.findById(id);
    if (!lead) throw new AppError("Lead not found", 404);
    lead.isDeleted = true;
    await lead.save();
  },

  // Used by CSV export — no pagination, same filters
  async getAllForExport(
    filters: LeadFilters,
    userId: string,
    isAdmin: boolean
  ): Promise<ILead[]> {
    const query = buildQuery(filters, userId, isAdmin);
    const sort  = filters.sort === "oldest" ? 1 : -1;
    return Lead.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: sort });
  },
};