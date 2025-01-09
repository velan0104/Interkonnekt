// import dbConnect from "@/lib/mongodb";
// import Posts from "@/models/post";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest) {
//   try {
//     const { userId } = await req.json();
//     console.log("userId at get posts:",userId)
//     // Connect to the database
//     await dbConnect();
//     let posts;
//     if(userId){
//       console.log("userId found");
//        posts = await Posts.find({user_id:userId}).lean();
//     }else{
//       // Fetch all posts
//     posts = await Posts.find({}).lean();
//     }
    

//     // Return posts as JSON
//     console.log("Posts fetched successfully: ", posts);
//     return NextResponse.json(
//       { message: "Posts fetched successfully", posts },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching posts: ", error);
//     return NextResponse.json(
//       { message: "Failed to fetch posts", error: error },
//       { status: 500 }
//     );
//   }
// }


import dbConnect from "@/lib/mongodb";
import Posts from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Get the raw body as text
    const bodyText = await req.text();
    let userId: string | null = null;

    // Parse the body if it's not empty
    if (bodyText) {
      const body = JSON.parse(bodyText);
      userId = body.userId || null;
    }

    console.log("userId at get posts:", userId);

    // Connect to the database
    await dbConnect();

    // Fetch posts based on userId
    // const posts =  userId
    //   ? await Posts.find({ user_id: userId }).lean()
    //   : await Posts.find({}).lean();

    const query = userId ? { user_id: userId } : {};
    const posts = await Posts.find(query).lean();

    console.log("Posts fetched successfully: ", posts);

    return NextResponse.json(
      { message: "Posts fetched successfully", posts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return NextResponse.json(
      { message: "Failed to fetch posts", error: error.message },
      { status: 500 }
    );
  }
}
