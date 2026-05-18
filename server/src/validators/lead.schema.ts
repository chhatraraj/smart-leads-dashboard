import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email("Invalid email"),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]).optional(),
  source: z.enum(["Website", "Instagram", "Referral"]),
});

export const updateLeadSchema = createLeadSchema.partial();

export const statusSchema = z.object({
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]),
});