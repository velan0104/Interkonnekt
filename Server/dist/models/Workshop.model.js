import mongoose, { Schema } from "mongoose";
const WorkshopSchema = new Schema({
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
}, { timestamps: true });
export const Workshop = mongoose.model("Workshop", WorkshopSchema);
