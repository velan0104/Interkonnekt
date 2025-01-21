import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  recipient: string;
  messageType: "text" | "file";
  content: string;
  fileUrl?: string;
  timestamp?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      ref: "users",
      required: true,
    },
    recipient: {
      type: String,
      ref: "users",
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
  }
  // {
  //   collection: "messages",
  // }
);

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  MessageSchema
);
export default Message;
