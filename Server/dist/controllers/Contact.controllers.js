import mongoose from "mongoose";
import { Message } from "../models/Message.model.js";
export const getContactForDMList = async (req, res) => {
    try {
        let userId = req.user?.id;
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    name: "$contactInfo.name",
                    image: "$contactInfo.image",
                    username: "$contactInfo.username",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            },
        ]);
        res.status(200).json({ contacts });
        return;
    }
    catch (error) {
        res.status(500).send("Internal server error");
        return;
    }
};
