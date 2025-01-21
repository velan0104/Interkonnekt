var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Message from "../models/Message.model.js";
export const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.userId);
        const user1 = req.userId;
        const user2 = req.body.id;
        console.log("User 1: " + user1 + "User2: " + user2);
        if (!user1 || !user2) {
            return res.status(400).send("Both user ID's are required.");
        }
        const messages = yield Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user2 },
            ],
        }).sort({ timeStamp: 1 });
        return res.status(200).json({ messages });
    }
    catch (error) {
        return res.status(500).send("Internal server error");
    }
});
