import mongoose from "mongoose";
import User from "../models/User.model.js";

const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "social_media" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      console.log(err.message);
    });
};

export default connectDB;
