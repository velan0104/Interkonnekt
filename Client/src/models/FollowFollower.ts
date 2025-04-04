// import mongoose, { Document, Types } from "mongoose";

// export interface FUser extends Document {
//   username: string;
//   email: string;
//   profileImage: string;
//   followers: Types.ObjectId[]; // Users who follow this user
//   following: Types.ObjectId[]; // Users this user is following
//   createdAt: Date;
//   updatedAt: Date;
// }

// const UserSchema: mongoose.Schema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     email: { type: String, required: true, unique: true },
//     profileImage: { type: String, default: "" },
//     followers: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // References to users following this user
//     ],
//     following: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // References to users this user is following
//     ],
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt fields automatically
//   }
// );

// export default mongoose.models.User ||
//   mongoose.model<FUser>("User", UserSchema);
