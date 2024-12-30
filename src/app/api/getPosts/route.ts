import dbConnect from "@/lib/mongodb";
import Posts from "@/models/post";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all posts
    const posts = await Posts.find({}).lean();

    // Return posts as JSON
    console.log("Posts fetched successfully: ", posts);
    return NextResponse.json(
      { message: "Posts fetched successfully", posts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return NextResponse.json(
      { message: "Failed to fetch posts", error: error },
      { status: 500 }
    );
  }
}
