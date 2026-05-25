import mongoose, { Document, Schema } from "mongoose";

export type LeadStatus = "new" | "contacted" | "qualified" | "closed";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed"],
      default: "new",
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: [true, "Source is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILead>("Lead", leadSchema);