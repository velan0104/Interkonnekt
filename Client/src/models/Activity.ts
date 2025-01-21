import mongoose, { Schema, Document, model } from "mongoose";

interface IUser {
  name: string;
  avatar: string;
}

export interface IActivity extends Document {
  likedById?: string,
    id?: string;
    post_id?: string;
  type: "like" | "comment" | "follow" | "unfollow";
  user: IUser;
  text?: string;
  timestamp?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
});

const ActivitySchema: Schema = new Schema({
  likedById: {type:String},
    id:{type:String},
post_id: {type:String},
  type: { 
    type: String, 
    enum: ["like", "comment", "follow", "unfollow"], 
    required: true 
  },
  user: { type: UserSchema, required: true },
  text: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Activity || model<IActivity>("Activity", ActivitySchema);
