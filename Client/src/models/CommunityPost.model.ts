import mongoose, { Model, Schema, Types } from "mongoose";

interface IComment {
  user: string;
  text: string;
  createdAt: Date;
}

interface ICommunityPost {
  title: string;
  content: string;
  media: string[];
  author: Types.ObjectId;
  community: Types.ObjectId;
  tags: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  isPinned: boolean;
  isWorkshop: boolean;
  workshopId?: Types.ObjectId;
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
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
  },
  { timestamps: true }
);

export const CommunityPost: Model<ICommunityPost> =
  mongoose.models.CommunityPost ||
  mongoose.model<ICommunityPost>("CommunityPost", CommunityPostSchema);
