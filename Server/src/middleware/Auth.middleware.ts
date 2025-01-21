import axios from "axios";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (req: any, res: any, next: NextFunction) => {
  const token = req.cookies["next-auth.session-token"];

  if (!token) return res.status(401).send("You are not authorized!");
  try {
    const payload = await axios.get("http://localhost:3000/api/getToken", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Payload: ", payload);
    if (payload) {
      req.user = payload?.data?.token;
      next();
    } else {
      return res.status(400).json("Unable to get payload");
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};
