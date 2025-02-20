import mongoose, { Model, Schema, Types } from "mongoose";

interface ICommunity {
  name: string;
  bio: string;
  admin: Types.ObjectId;
  members: Types.ObjectId[];
  banner: string;
  category: string;
  profilePic: string;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/drjkcwu5x/image/upload/v1739278893/gg0dcluhoxi9e3apu1qj.png",
    },
    banner: {
      type: String,
      default:
        "https://res.cloudinary.com/drjkcwu5x/image/upload/v1738936679/360_F_535353834_fAKyu7nTpbpNux5XdR5T63OUJ6gDOHlD_pdfq3b.jpg",
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Community: Model<ICommunity> = mongoose.model<ICommunity>(
  "Community",
  CommunitySchema
);
