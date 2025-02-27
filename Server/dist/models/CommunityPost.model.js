import mongoose, { Schema } from "mongoose";
// Poll Schema (Embedded)
const PollSchema = new Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    votes: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            optionIndex: { type: Number, required: true },
        },
    ],
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
}, { _id: false });
const CommunityPostSchema = new Schema({
    title: { type: String },
    content: { type: String },
    media: [{ type: String }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    community: {
        type: Schema.Types.ObjectId,
        ref: "Community",
        required: true,
    },
    tags: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", required: true }],
    isPinned: { type: Boolean, default: false },
    isWorkshop: { type: Boolean, default: false },
    workshopId: {
        type: Schema.Types.ObjectId,
        required: function () {
            return this.isWorkshop; // Required only if isWorkshop is true
        },
    },
    poll: { type: PollSchema, required: false },
}, { timestamps: true });
CommunityPostSchema.pre("save", function (next) {
    if (!this.content && (!this.media || this.media.length === 0) && !this.poll) {
        return next(new Error("A post must have content, media, or a poll."));
    }
    next();
});
const CommunityPost = mongoose.models.CommunityPost ||
    mongoose.model("CommunityPost", CommunityPostSchema);
export default CommunityPost;
