import dbConnect from "@/lib/mongodb";
import Posts from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // Parse the request body to get the post_id
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find and delete the post
    const deletedPost = await Posts.findOneAndDelete({ _id: postId });

    if (!deletedPost) {
      return NextResponse.json(
        { message: "Post not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully", deletedPost },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Failed to delete post", error: error.message },
      { status: 500 }
    );
  }
}
