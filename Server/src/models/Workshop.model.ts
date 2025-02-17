import mongoose, { Schema, Types, Model } from "mongoose";

interface IWorkshop {
  title: string;
  description: string;
  host: Types.ObjectId;
  participants: Types.ObjectId[];
  startTime: Date;
  endTime?: Date;
  category: string;
  meetingLink?: string;
  bannerImage: string;
  maxParticipants?: number;
  isCompleted: boolean;
}

const WorkshopSchema = new Schema<IWorkshop>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    category: { type: String, required: true },
    meetingLink: { type: String },
    bannerImage: { type: String, required: true },
    maxParticipants: { type: Number },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Workshop: Model<IWorkshop> = mongoose.model<IWorkshop>(
  "Workshop",
  WorkshopSchema
);
