import mongoose, { Document, Model, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  messageType: "text" | "file";
  content: string;
  fileUrl?: string;
  timestamp?: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function (this: { messageType: string }) {
      return this.messageType === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function (this: { messageType: string }) {
      return this.messageType === "file";
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
