// /pages/api/posts/like.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Posts from "@/models/post";

export async function POST(req: NextRequest) {
  const { postId, userId } = await req.json();

  try {
    if (!postId || !userId) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await dbConnect();

    const post = await Posts.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingLike = post.likes.find((like: any) => like.userId === userId);
    if (existingLike) {
      post.likes = post.likes.filter((like: any) => like.userId !== userId);
      post.likeCount -= 1;
      post.likes.userId = "";
    } else {
      // Add the like
      post.likes.push({ post_id: postId, userId: userId });
      post.likeCount += 1; // Increment like count
    }
    await post.save();

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    // console.error("Error in like API:", error);
    return NextResponse.json({ error: "Error updating like" }, { status: 500 });
  }
}
