import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY;
// console.log("secret key: ",SECRET_KEY);

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
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Verify the password
    const isPasswordValid = await password == user.password;
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // if (!SECRET_KEY) {
    //     return NextResponse.json(
    //       { message: "Server misconfiguration: Missing secret key" },
    //       { status: 500 }
    //     );
    //   }

      
    // const token = jwt.sign(
    //     { id: user._id, email: user.email }, // Payload
    //     SECRET_KEY, // Secret key
    //     { expiresIn: "1d" } // Token expiry
    //   );

    //   console.log("token: ",token)



    // Success response
    const response =  NextResponse.json(
      { message: "Sign-in successful", user: { id: user._id, email: user.email } },
      { status: 200 }
    );

    // response.cookies.set("token",token,{
    //     httpOnly: true,
    //     secure: true,
    //     path: "/",
    //     maxAge: 3600
    // })
    return response;

  } catch (error: any) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
