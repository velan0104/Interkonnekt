import { Message } from "../models/Message.model.js";

export const getMessage = async (req: any, res: any) => {
  try {
    console.log(req.userId);
    const user1 = req.userId;
    const user2 = req.body.id;

    console.log("User 1: " + user1 + "User2: " + user2);

    if (!user1 || !user2) {
      return res.status(400).send("Both user ID's are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user2 },
      ],
    }).sort({ timeStamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};
