import mongoose, { Schema } from "mongoose";
const ChannelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Message",
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
const Channel = mongoose.model("Channel", ChannelSchema);
export default Channel;
