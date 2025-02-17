import axios from "axios";
import asyncHandler from "express-async-handler";
export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies["next-auth.session-token"];
        console.log("Token:", token);
        // If there's no token, return a 401 Unauthorized error
        if (!token) {
            res.status(401).json({ error: "You are not authorized!" });
            return;
        }
        // Request to validate the token and get user details
        const { data } = await axios.get("http://localhost:3000/api/getToken", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        // If token is valid, attach the user to the request object
        if (data?.token) {
            const user = {
                name: data.token.name,
                username: data.token.username,
                email: data.token.email,
                interest: data.token.interest,
                id: data.token.id,
                provider: data.token.provider,
            };
            req.user = user; // Attach the token or user information to the request
            console.log("REQ USER:", req.user);
            return next(); // Proceed to the next middleware/route
        }
        else {
            // If payload is not valid, send a 400 Bad Request response
            res.status(400).json({ error: "Unable to get payload" });
            return;
        }
    }
    catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ error: "Internal Server Error", details: error });
        return;
    }
});
