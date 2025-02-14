import mongoose, { Schema, model, models } from "mongoose";

interface IComment {
  userId: string;
  post_id: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema({
  // id: {type: String, required: true},
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  userId: { type: String, ref: "users", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

interface ILike {
  userId: string;
  post_id: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    userId: { type: String, ref: "users", required: true }, // Array of user objects with userId

    createdAt: { type: Date, default: Date.now },
  }
  // {_id: false}
);

// export interface Like{
//   [
//     {
//       post_id: { type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true },
//       userId: { type: String, ref: "users", required: true }, // Array of user objects with userId

//       createdAt: { type: Date, default: Date.now },
//     },
//     {_id: false}
//   ]
// }

export interface PollOptions {
  question: string;
  options: { option: string; votes: string[] }[];
}

export interface IPost {
  _id: string;
  user_id: string;
  newUsername?: string;
  name: String;
  profileImage: string;
  content: string;

  poll: PollOptions[];
  image?: string;
  likes: ILike[];
  comments: IComment[];
  likeCount: number;
  commentCount: number;
}

const PostSchema = new Schema<IPost>({
  // id:{
  //     type: String,
  //     required: true,
  // },
  user_id: {
    type: String,

    required: true,
  },
  newUsername: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  likes: [LikeSchema],
  comments: [CommentSchema],
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  poll: {
    type: [
      {
        question: { type: String },
        options: [
          {
            optionValue: { type: String, required: true },
            votes: { type: [String], default: [] },
          },
        ],
      },
    ],
  },
});

const Posts = models.Post || model<IPost>("Post", PostSchema);
export default Posts;
