import mongoose, { Schema } from "mongoose";
const MessageSchema = new Schema({
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
        required: function () {
            return this.messageType === "text";
        },
    },
    fileUrl: {
        type: String,
        required: function () {
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
const Message = mongoose.model("Message", MessageSchema);
export default Message;
