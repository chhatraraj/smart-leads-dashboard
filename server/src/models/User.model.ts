import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "sales_user";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ["admin", "sales_user"],
      default: "sales_user",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Hash password before saving — completely clean async version
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip sensitive fields from JSON output
userSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", userSchema);