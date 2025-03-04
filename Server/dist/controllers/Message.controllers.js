import { Message } from "../models/Message.model.js";
import mongoose from "mongoose";
export const getMessage = async (req, res) => {
    try {
        const user1 = new mongoose.Types.ObjectId(req.user?.id);
        const user2 = new mongoose.Types.ObjectId(req.body.id);
        // console.log("User 1: " + user1 + " User2: " + user2);
        // console.log("TYPE: USER1: " + typeof user1 + " USER2: " + typeof user2);
        if (!user1 || !user2) {
            res.status(400).send("Both user ID's are required.");
            return;
        }
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 });
        res.status(200).json({ messages });
        return;
    }
    catch (error) {
        res.status(500).send("Internal server error");
        return;
    }
};
