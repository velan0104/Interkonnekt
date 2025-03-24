import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import Posts from "@/models/post";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
 
   
console.log("api called");
    const { id, interest, email ,profileImage, username} = await req.json();
    // console.log("profileImage at insert: ",profileImage)
    // console.log("id at insert: ",id)
    // console.log("interest at insert: ",interest)
    // console.log("email at insertsss: ",email)
    // console.log("username at insert: ",username)

    
   

// if ( !username || !email ||!interest) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

if (!email) {
  return NextResponse.json({ message: "Email is required" }, { status: 400 });
}

if (!id) {
  console.warn("id is missing");
 // return NextResponse.json({ message: "Username is missing" }, { status: 400 });
}
if (!profileImage) {
  console.warn("Profile image is missing");
 // return NextResponse.json({ message: "Profile image is missing" }, { status: 400 });
}

    await dbConnect();

    // const isDuplicateUsername = await User.findOne({ 
    //   username, 
    //   id: { $ne: id } // Exclude the current user
    // });
    
    // if (isDuplicateUsername) {
    //   return NextResponse.json(
    //     { message: `Username "${username}" is already taken` },
    //     { status: 400 }
    //   );
    // }

    const existingUsername = await User.findOne({ $or: [{ email }, { id }] });
    const existingUser2 = await Posts.find({user_id: id});
    const existingUser3 = await Activity.find({id: id});
    // console.log("existing user2: ",existingUser2)
    // console.log("existing user: ",existingUsername)
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
      existingUser2.profileImage = profileImage;
    }
    if(username){
      existingUsername.username = username;
    }
    if(interest){
      const interestsArray = typeof interest === "string" ? interest.split(",") : interest;
      existingUsername.interest = interestsArray;
    }
    await existingUsername.save();

    
    // await existingUsername.save();
    // if(existingUser2){
    // await existingUser2.save();
    // }

  //   for (const user of existingUsername) {
  //     if (profileImage) {
  //         user.image = profileImage;
  //     }
  //     if (username) {
  //       console.log("changing username ")
  //         user.username = username;
  //     }
  //     if (interest) {
  //         const interestsArray = typeof interest === "string" ? interest.split(",") : interest;
  //         user.interest = interestsArray;
  //     }
  //     await user.save();
  // }

  // Update and save each post
  for (const post of existingUser2) {
      if (profileImage) {
          post.profileImage = profileImage;
      }
      await post.save();
  }

    return NextResponse.json({message:"profile updated successfully",existingUsername}, { status: 200 });
   

   
  
}
