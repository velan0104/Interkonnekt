
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  // const router = useRouter();
  // const {userId} = router.query;
  // const params = useSearchParams();
  //   const userId2 = params.get("userId");

  // const url = new URL(req.url);
  // const userId = url.searchParams.get("userId");

    const {userId} = await req.json();
   
    console.log("userId at getUnameInterest: ",userId)
  // console.log("email at getUnameInterest: ",email)

    if ( !userId) {
        return NextResponse.json(
          { message: "All fields are required" },
          { status: 400 }
        );
      }
    
      await dbConnect();
    
      const existingUser = await User.findOne({ id: userId });
     // console.log("existing user: ",existingUser)
    
      if (!existingUser) {
        return NextResponse.json(
          { message: "User with this email does not exist" },
          { status: 401 }
        );
      }
    
      return NextResponse.json({message:"user found", username: existingUser.username, interest: existingUser.interest,image:existingUser.image, email: existingUser.email, createdAt: existingUser.createdAt,followers:existingUser.followers,following:existingUser.following,name:existingUser.name}, { status: 200 });
}