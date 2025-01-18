
import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  

    const {userId} = await req.json();
   
    console.log("userId at getUnameInterest: ",userId)
  

    if ( !userId) {
        return NextResponse.json(
          { message: "All fields are required" },
          { status: 400 }
        );
      }
    
      await dbConnect();
    
      const existingUser = await User.findOne({ id: userId });
    
    
      if (!existingUser) {
        return NextResponse.json(
          { message: "User with this email does not exist" },
          { status: 401 }
        );
      }
    
      return NextResponse.json({message:"user found", username: existingUser.username, interest: existingUser.interest,image:existingUser.image, email: existingUser.email, createdAt: existingUser.createdAt,followers:existingUser.followers,following:existingUser.following,name:existingUser.name}, { status: 200 });
}

// import dbConnect from "@/lib/mongodb";
// import User from "@/models/user";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   // Parse the JSON body
//   const { userId } = await req.json();

//   try {
//     // Connect to the database
//     await dbConnect();

//     // Check if a specific userId is provided
//     if (userId) {
//       const existingUser = await User.findOne({ id: userId });

//       if (!existingUser) {
//         return NextResponse.json(
//           { message: "User with this ID does not exist" },
//           { status: 404 }
//         );
//       }

//       // Return specific user details
//       return NextResponse.json(
//         {
//           message: "User found",
//           user: {
//             username: existingUser.username,
//             interest: existingUser.interest,
//             image: existingUser.image,
//             email: existingUser.email,
//             createdAt: existingUser.createdAt,
//             followers: existingUser.followers,
//             following: existingUser.following,
//             name: existingUser.name,
//           },
//         },
//         { status: 200 }
//       );
//     } else {
//       // Fetch all users from the database
//       console.log("fetching all users")
//       const allUsers = await User.find();

//       // Return all users
//       return NextResponse.json(
//         {
//           message: "All users fetched successfully",
//           users: allUsers,
//         },
//         { status: 200 }
//       );
//     }
//   } catch (error) {
//     console.error("Error in fetching user(s):", error);
//     return NextResponse.json(
//       { message: "An error occurred while fetching user(s)" },
//       { status: 500 }
//     );
//   }
// }
