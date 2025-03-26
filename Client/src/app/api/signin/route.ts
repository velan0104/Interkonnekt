import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify the password
    const isPasswordValid = (await password) == user.password;
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Sign-in successful",
        user: { id: user._id, email: user.email },
      },
      { status: 200 }
    );
    return response;
  } catch (error: any) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
