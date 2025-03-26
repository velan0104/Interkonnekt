import { Socket, Server as SocketIoServer } from "socket.io";
import Channel from "../models/Channel.models.js";
import { Message } from "../models/Message.model.js";
import { IMessage } from "../models/Message.model.js";
import User from "../models/User.model.js";
import { Types } from "mongoose";

interface HandShakeQuery {
  userId: string;
  interests: string[];
}

const setUpSocket = (server: any) => {
  const findRandomUser = (currentUserId: string, selectedInterest: string) => {
    const filteredUsers = [...onlineUsers.entries()].filter(
      ([id, data]) =>
        id !== currentUserId && data.interests?.includes(selectedInterest)
    );

    if (filteredUsers.length === 0) return null;
    const randomUser =
      filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
    return randomUser[0]; // return userId
  };

  const io = new SocketIoServer(server, {
    cors: {
      origin: [process.env.ORIGIN as string, "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const onlineUsers = new Map<
    string,
    { socketId: string; interests: string[] }
  >();

  const declinedUsers = new Map<string, Set<string>>();
  const disconnect = (socket: Socket) => {
    // console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId.socketId === socket.id) {
        onlineUsers.delete(userId);
        declinedUsers.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message: IMessage) => {
    // console.log("Message: ", message);
    const senderSocketId = onlineUsers.get(message.sender.toString());
    const recipientSocketId = onlineUsers.get(message.recipient.toString());
    // console.log(
    //   "Sender: " + senderSocketId + " Receiver: " + recipientSocketId
    // );
    let createdMessage = null;
    try {
      createdMessage = await Message.create(message);
      // console.log("CREATED MESSAGE: ", createdMessage);
    } catch (error) {
      console.log("Failed to create message db: ", error);
    }

    let messageData = null;
    try {
      messageData = await Message.findById(createdMessage?._id)
        .populate("sender", "_id email name image")
        .populate("recipient", "_id email name image")
        .exec();
    } catch (error) {
      console.log("MESSAGE DATA: ", error);
    }

    if (recipientSocketId) {
      io.to(recipientSocketId.socketId).emit("receiveMessage", messageData); // IN place of message messageData come from above
    }

    if (senderSocketId) {
      io.to(senderSocketId.socketId).emit("receiveMessage", messageData); // IN place of message messageData come from above
    }
  };

  const sendChannelMessage = async (
    message: IMessage & { channelId: string }
  ) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email name image")
      .exec();

    const updatedChannelChat = await Channel.findByIdAndUpdate(
      channelId,
      {
        $push: { messages: createdMessage._id },
      },
      { new: true }
    );

    const channel = await Channel.findById(channelId).populate("members");
    if (channel) {
      const finalData = { ...messageData?.toObject(), channelId: channel._id };

      if (channel.members) {
        channel.members.forEach((member) => {
          const memberSocketId = onlineUsers.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId.socketId).emit(
              "receiveChannelMessage",
              finalData
            );
          }
        });
        const adminSocketId = onlineUsers.get(channel.admin._id.toString());
        if (adminSocketId) {
          io.to(adminSocketId.socketId).emit(
            "receiveChannelMessage",
            finalData
          );
        }
      }
    }
  };

  const findMatch = async (user: {
    sender: string;
    selectedInterest: string;
  }) => {
    const senderSocketId = onlineUsers?.get(user?.sender)?.socketId;

    // Get the list of users who have declined calls from this sender
    const declinedUserIds = declinedUsers.get(user.sender) || new Set();

    const filteredUsers = [...onlineUsers.entries()].filter(
      ([id, data]) =>
        id !== user.sender &&
        data.interests?.includes(user.selectedInterest.toLowerCase()) &&
        !declinedUserIds.has(id) // Filter out users who have declined calls
    );

    if (filteredUsers.length === 0) {
      io.to(senderSocketId!).emit("noMatchFound");
      return;
    }

    const randomUser =
      filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
    const matchedUserId = randomUser[0]; // return userId

    const matchedUser = await User.findById(matchedUserId).select(
      "name username image"
    );

    if (matchedUserId) {
      const receiverSocketId = onlineUsers.get(matchedUserId)?.socketId;

      io.to(senderSocketId!).emit("matchedUser", matchedUser);
    }
  };

  const connectCall = async ({
    senderId,
    receiverId,
    category,
  }: {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    category: string;
  }) => {
    const senderSocketId = onlineUsers.get(senderId.toString())?.socketId;
    const receiverSocketId = onlineUsers.get(receiverId.toString())?.socketId;

    const user = await User.findById(senderId).select("name username image");
    const caller = {
      _id: user._id,
      name: user.name,
      username: user.username,
      image: user.image,
      interests: category,
    };

    io.to(receiverSocketId!).emit("incomingCall", {
      from: caller,
      callId: `1v1-${senderId}-${receiverId}`,
    });
  };

  const handleAcceptCall = async ({
    sender,
    receiver,
  }: {
    sender: Types.ObjectId | string;
    receiver: Types.ObjectId | string;
  }) => {
    console.log("CALL ACCEPTED");
    if (sender && receiver) {
      const senderSocketId = onlineUsers.get(sender.toString())?.socketId;
      const receiverSocketId = onlineUsers.get(receiver.toString())?.socketId;

      const callId = `1v1-${sender.toString()}-${receiver.toString()}`;
      io.to([senderSocketId!, receiverSocketId!]).emit("acceptedCall", callId);
    }
  };

  const handleDeclineCall = ({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) => {
    io.to(onlineUsers.get(senderId!)?.socketId!).emit("callDeclined");
    // Store the user who declined the call

    if (!declinedUsers.has(senderId)) {
      declinedUsers.set(senderId, new Set());
    }
    declinedUsers.get(senderId)?.add(receiverId);
  };

  io.on("connection", (socket) => {
    const query = socket.handshake.query as unknown as HandShakeQuery;
    const userId = query.userId;
    const interests = query.interests;

    if (userId) {
      onlineUsers.set(userId, { socketId: socket.id, interests });
    } else {
      console.log("User ID not provided during connection.");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on("findMatch", findMatch);
    socket.on("acceptCall", handleAcceptCall);
    socket.on("declineCall", handleDeclineCall);
    socket.on("connectCall", connectCall);

    socket.on("disconnect", () => disconnect);
  });
};

export default setUpSocket;
