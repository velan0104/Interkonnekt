import axios from "axios";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, Token, IUserToken } from "../lib/type.js"; // Assuming this is the correct path
import asyncHandler from "express-async-handler";
import User from "../models/User.model.js";
import { Types } from "mongoose";

export const verifyToken = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies["next-auth.session-token"];

      if (!token) {
        res.status(401).json({ error: "You are not authorized!" });
        return;
      }

      const { data } = await axios.get<{ token: Token }>(
        "http://localhost:3000/api/getToken",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data?.token) {
        let userId: Types.ObjectId | string = "";
        let interest: string[] = [];
        let username = "";
        if (data.token.id.length === 21) {
          const user = await User.findOne(
            { email: data.token.email },
            "interest username"
          );
          userId = user?._id;
          interest = user.interest;
          username = user.username;
        } else {
          userId = data.token.id;
          username = data.token.username;
          interest = data.token.interest;
        }
        const user: IUserToken = {
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
      } else {
        res.status(400).json({ error: "Unable to get payload" });
        return;
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error });
      return;
    }
  }
);
