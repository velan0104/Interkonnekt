import axios from "axios";
import asyncHandler from "express-async-handler";
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
            const user = {
                name: data.token.name,
                username: data.token.username,
                email: data.token.email,
                interest: data.token.interest,
                id: data.token.id,
                provider: data.token.provider,
            };
            req.user = user;
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
