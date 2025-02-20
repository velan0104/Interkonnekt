import mongoose from "mongoose";
const FollowerSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
    },
});
const FollowingSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "User",
    },
});
const UserSchema = new mongoose.Schema({
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
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
