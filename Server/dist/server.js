import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connect.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import setUpSocket from "./services/socket.js";
import messageRoute from "./routes/Message.route.js";
import contactRoute from "./routes/Contact.route.js";
import communityRoute from "./routes/Community.route.js";
import mongoose from "mongoose";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const databaseURL = process.env.DATABASE_URL;
connectDB(databaseURL);
app.use(cors({
    origin: [process.env.ORIGIN, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/message", messageRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/community", communityRoute);
const server = app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
setUpSocket(server);
console.log("mongoose : ", mongoose.modelNames());
