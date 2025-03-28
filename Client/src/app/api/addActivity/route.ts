import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import Posts from "@/models/post";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { likedById, id, post_id, type, user, text } = await req.json();

    if (type === "like") {
      // Convert postId to ObjectId
      const postIdObject = new mongoose.Types.ObjectId(post_id);

      // Find the post
      const post = await Posts.findOne({ _id: postIdObject });
      if (!post) {
        return NextResponse.json(
          { message: "Post not found" },
          { status: 404 }
        );
      }

      // Check if the user already liked the post
      const alreadyLiked = post.likes.some(
        (like: any) => like.userId === likedById
      );
      if (alreadyLiked) {
        const newActivity = new Activity({ id, post_id, type, user, text });
        await newActivity.save();
      }

      // Check if the activity already exists
      const existingActivity = await Activity.findOne({ id, post_id, type });
      if (existingActivity) {
        return NextResponse.json(
          { message: "Activity already exists" },
          { status: 409 }
        );
      }

      // Create and save the new activity
      const newActivity = new Activity({ id, post_id, type, user, text });
      await newActivity.save();

      return NextResponse.json(
        { message: "Activity added successfully" },
        { status: 200 }
      );
    }

    if (type == "comment") {
      const postIdString = post_id.toString();
      const postIdObject = new mongoose.Types.ObjectId(postIdString);

      const post = await Posts.find(postIdObject);
      post.map(async (post) => {
        if (post.user_id != id) {
          const newActivity = new Activity({ id, post_id, type, user, text });
          await newActivity.save();
        }
      });
    }
    const newActivity = new Activity({ id, type, user, text });
    //  console.log("activity in else: ",newActivity);
    await newActivity.save();
    return NextResponse.json(
      { message: "activity uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json(
      { message: "error uploading activities" },
      { status: 500 }
    );
  }
}
