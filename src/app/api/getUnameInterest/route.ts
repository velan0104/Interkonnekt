import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {userId} = await req.json();
    console.log("email at getUnameInterest: ",userId)

    if ( !userId) {
        return NextResponse.json(
          { message: "All fields are required" },
          { status: 400 }
        );
      }
    
      await dbConnect();
    
      const existingUser = await User.findOne({ userId });
    
      if (!existingUser) {
        return NextResponse.json(
          { message: "User with this email does not exist" },
          { status: 401 }
        );
      }
    
      return NextResponse.json({message:"user found", username: existingUser.username, interest: existingUser.interest,image:existingUser.image, email: existingUser.email}, { status: 200 });
}