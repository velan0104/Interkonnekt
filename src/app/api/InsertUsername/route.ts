import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 
   
console.log("api called");
    const { username, interest, email ,profileImage} = await req.json();
    console.log("profileImage at insert: ",profileImage)
    console.log("username at insert: ",username)
    console.log("interest at insert: ",interest)
    console.log("email at insertsss: ",email)
   

// if ( !username || !email ||!interest) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

if (!email) {
  return NextResponse.json({ message: "Email is required" }, { status: 400 });
}

if (!username) {
  console.warn("Username is missing");
 // return NextResponse.json({ message: "Username is missing" }, { status: 400 });
}
if (!profileImage) {
  console.warn("Profile image is missing");
 // return NextResponse.json({ message: "Profile image is missing" }, { status: 400 });
}

    await dbConnect();

    const existingUsername = await User.findOne({ $or: [{ email }, { username }] });
    // if (!existingUsername) {
    //   return NextResponse.json(
    //     { message: "Username does not exists" },
    //     { status: 400 }
    //   );
    // }

    //const existingUser = await User.findOne({ email });

    if (!existingUsername) {
      return NextResponse.json(
        { message: "User with this email does not exist" },
        { status: 400 }
      );
    }
    if(profileImage){
      existingUsername.image = profileImage;
    }
    if(username){
      existingUsername.username = username;
    }
    if(interest){
      const interestsArray = typeof interest === "string" ? interest.split(",") : interest;
      existingUsername.interest = interestsArray;
    }
    

    
    await existingUsername.save();

    return NextResponse.json({message:"profile updated successfully",existingUsername}, { status: 200 });
   

   
  
}
