import mongoose from "mongoose";

const connectDB = (uri: string) => {
  mongoose
    .connect(uri, { dbName: "Project 0" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      console.log(err.message);
    });
};

export default connectDB;
