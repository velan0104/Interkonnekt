import mongoose, { Model, Schema } from "mongoose";

interface IChannel extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  admin: mongoose.Types.ObjectId;
  image?: string;
  messages: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChannelSchema = new Schema<IChannel>({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  admin: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Messages",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

ChannelSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

ChannelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel: Model<IChannel> = mongoose.model("Channels", ChannelSchema);
export default Channel;
