import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, password, interest } = body;
    console.log("interest at signup: ", interest);

    if (!name || !username || !email || !password || !interest) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: username,
      name,
      username,
      email,
      password,
      interest,
    });

    console.log(newUser);

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
