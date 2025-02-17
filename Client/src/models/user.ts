import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IFollowers {
  userId: string;
}

const FollowerSchema = new Schema<IFollowers>({
  userId: {
    type: String,
    ref: "users",
  },
});

const FollowingSchema = new Schema<IFollowing>({
  userId: {
    type: String,
    ref: "users",
  },
});

export interface IFollowing {
  userId: string;
}
interface IUser extends Document {
  id?: string;
  name: string;
  username?: string;
  email: string;
  password?: string;
  interest?: string[];
  createdAt: Date;
  image?: string;
  followers: IFollowers[];
  following: IFollowing[];
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [5, "Username must be at least 2 characters"],
      maxlength: [30, "Username must not exceed 30 characters"],
    },
    username: {
      type: String,
      // required: [true, "Username is required"],
      unique: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [30, "Username must not exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    interest: {
      type: [String],
      // required: [true, "interest is required"]
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String,
    },
    id: {
      type: String,
    },
    followers: { type: [FollowerSchema], default: [] },
    following: { type: [FollowingSchema], default: [] },
  }
  // {
  //   collection: "users",
  // }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
