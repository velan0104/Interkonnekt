import mongoose, { Schema, Types } from "mongoose";
const CommunityPostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    media: [
        {
            type: String,
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: "Community",
        required: true,
    },
    tags: {
        type: String,
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    isPinned: { type: Boolean, default: false },
    isWorkshop: { type: Boolean, default: false },
    workshopId: { type: Types.ObjectId, required: false },
}, { timestamps: true });
export const CommunityPost = mongoose.model("CommunityPost", CommunityPostSchema);
