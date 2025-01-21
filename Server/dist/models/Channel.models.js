import mongoose, { Schema } from "mongoose";
const ChannelSchema = new Schema({
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
const Channel = mongoose.model("Channels", ChannelSchema);
export default Channel;
