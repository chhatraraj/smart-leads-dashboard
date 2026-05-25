import { z } from "zod";

export const createLeadSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email("Invalid email"),
  phone:   z.string().optional(),
  company: z.string().optional(),
  notes:   z.string().optional(),
  status:  z.enum(["new", "contacted", "qualified", "closed"]).optional(),
  source:  z.enum(["Website", "Instagram", "Referral"]),
});

export const updateLeadSchema = createLeadSchema.partial();

export const statusSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "closed"]),
});