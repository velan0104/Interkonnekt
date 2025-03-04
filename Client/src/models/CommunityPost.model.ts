import mongoose, { Model, Schema, Types } from "mongoose";
import { ICommentSchema } from "./Comments.models";

interface IComment {
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IPoll {
  question: string;
  options: string[];
  votes: {
    user: Types.ObjectId;
    optionIndex: number;
  }[];
  expiresAt?: Date;
  isActive: boolean;
}

export interface ICommunityPost {
  title?: string;
  content?: string;
  media?: string[];
  author: Types.ObjectId;
  community: Types.ObjectId;
  tags?: string;
  likes: Types.ObjectId[];
  comments: ICommentSchema[];
  isPinned: boolean;
  isWorkshop: boolean;
  workshopId?: Types.ObjectId;
  poll?: IPoll;
}

// Poll Schema (Embedded)
const PollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    votes: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        optionIndex: { type: Number, required: true },
      },
    ],
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    title: { type: String },
    content: { type: String },
    media: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    tags: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", required: true }],
    isPinned: { type: Boolean, default: false },
    isWorkshop: { type: Boolean, default: false },
    workshopId: {
      type: Schema.Types.ObjectId,
      required: function () {
        return this.isWorkshop; // Required only if isWorkshop is true
      },
    },
    poll: { type: PollSchema, required: false },
  },
  { timestamps: true }
);

// Ensure at least `content + media` OR `poll` exists
CommunityPostSchema.pre("save", function (next) {
  if (!this.content && (!this.media || this.media.length === 0) && !this.poll) {
    return next(new Error("A post must have content, media, or a poll."));
  }
  next();
});

export const CommunityPost: Model<ICommunityPost> =
  mongoose.models.CommunityPost ||
  mongoose.model<ICommunityPost>("CommunityPost", CommunityPostSchema);
