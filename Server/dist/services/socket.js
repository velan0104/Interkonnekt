var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Server as SocketIoServer } from "socket.io";
import Channel from "../models/Channel.models.js";
import Message from "../models/Message.model.js";
const setUpSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: [process.env.ORIGIN, "http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };
    const sendMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Message: ", message);
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        console.log("Sender: " + senderSocketId + " Receiver: " + recipientSocketId);
        let createdMessage = null;
        try {
            createdMessage = yield Message.create(message);
            console.log("CREATED MESSAGE: ", createdMessage);
        }
        catch (error) {
            console.log("Failed to create message db: ", error);
        }
        let messageData = null;
        try {
            messageData = yield Message.findById(createdMessage === null || createdMessage === void 0 ? void 0 : createdMessage._id)
                .populate("sender", "_id email name image")
                .populate("recipient", "_id email name image");
        }
        catch (error) {
            console.log("MESSAGE DATA: ", error);
        }
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", messageData); // IN place of message messageData come from above
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage", messageData); // IN place of message messageData come from above
        }
    });
    const sendChannelMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { channelId, sender, content, messageType, fileUrl } = message;
        const createdMessage = yield Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl,
        });
        const messageData = yield Message.findById(createdMessage._id)
            .populate("sender", "id email name image")
            .exec();
        const updatedChannelChat = yield Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id },
        }, { new: true });
        console.log("Updated chat: ", updatedChannelChat);
        const channel = yield Channel.findById(channelId).populate("members");
        if (channel) {
            const finalData = Object.assign(Object.assign({}, messageData === null || messageData === void 0 ? void 0 : messageData.toObject()), { channelId: channel._id });
            if (channel.members) {
                channel.members.forEach((member) => {
                    const memberSocketId = userSocketMap.get(member._id.toString());
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("receiveChannelMessage", finalData);
                    }
                });
                const adminSocketId = userSocketMap.get(channel.admin._id.toString());
                if (adminSocketId) {
                    io.to(adminSocketId).emit("receiveChannelMessage", finalData);
                }
            }
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        }
        else {
            console.log("User ID not provided during connection.");
        }
        console.log("Connection Builded");
        socket.on("sendMessage", sendMessage);
        socket.on("sendChannelMessage", sendChannelMessage);
        socket.on("disconnect", () => disconnect);
    });
};
export default setUpSocket;
