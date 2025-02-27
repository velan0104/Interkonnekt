import mongoose, { Model, Types } from "mongoose";

export interface ICommentSchema {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
}

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment: Model<ICommentSchema> =
  mongoose.models.CommentSchema ||
  mongoose.model<ICommentSchema>("CommentSchema", CommentSchema);
