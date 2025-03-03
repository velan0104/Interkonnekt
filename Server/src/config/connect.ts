import mongoose from "mongoose";
import User from "../models/User.model.js";

const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "social_media" })
    .then(async (data) => {
      console.log(`Connected to DB: ${data.connection.host}`);
      // const user = await User.find();
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export default connectDB;
