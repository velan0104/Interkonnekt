import mongoose from "mongoose";
const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "test" })
        .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
        .catch((err) => {
        console.log(err.message);
    });
};
export default connectDB;
