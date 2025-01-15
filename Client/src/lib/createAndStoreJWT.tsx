"use server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default function handler(req, res) {
  const payload = { userId: "12345", name: "John Doe" };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "1h",
  });

  res.setHeader(
    "Set-Cookie",
    serialize("auth_token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    })
  );

  res.status(200).json({ message: "Token set in cookie" });
}
