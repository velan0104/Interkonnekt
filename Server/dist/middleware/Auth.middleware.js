import axios from "axios";
import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies["next-auth.session-token"];
        if (!token) {
            res.status(401).json({ error: "You are not authorized!" });
            return;
        }
        const { data } = await axios.get("http://localhost:3000/api/getToken", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (data?.token) {
            let userId = "";
            let interest = [];
            let username = "";
            if (data.token.id.length === 21) {
                const user = await User.findOne({ email: data.token.email }, "interest username");
                userId = user?._id;
                interest = user.interest;
                username = user.username;
            }
            else {
                userId = data.token.id;
                username = data.token.username;
                interest = data.token.interest;
            }
            const user = {
                name: data.token.name,
                username: username,
                email: data.token.email,
                interest: interest,
                id: userId,
                provider: data.token.provider,
            };
            req.user = user;
            console.log("USER", user);
            return next();
        }
        else {
            res.status(400).json({ error: "Unable to get payload" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
        return;
    }
});
