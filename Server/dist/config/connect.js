import mongoose from "mongoose";
const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "social_media" })
        .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
        .catch((err) => {
        console.log(err.message);
    });
};
export default connectDB;
