import dbConnect from "@/lib/mongodb";
import Posts from "@/models/post";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    let userId = null;

    if (bodyText) {
      const body = JSON.parse(bodyText);
      userId = body.userId || null;
    }

    await dbConnect();

    let posts = [];

    if (userId) {
      posts = await Posts.find({ user_id: userId }).lean();
    } else {
      const sessionUserId = bodyText
        ? JSON.parse(bodyText).sessionUserId
        : null;
      if (sessionUserId) {
        const user = await User.findById(sessionUserId)
          .select("interest")
          .lean();
        if (user && user.interest?.length > 0) {
          const usersWithSimilarInterests = await User.find({
            _id: { $ne: sessionUserId },
            interest: { $in: user.interest },
          })
            .select("_id")
            .lean();

          const userIds = usersWithSimilarInterests.map((u) => u._id);

          const interestPosts = await Posts.find({
            user_id: { $in: userIds },
          }).lean();

          const sessionUserPosts = await Posts.find({
            user_id: sessionUserId,
          }).lean();

          const remainingPosts = await Posts.find({
            user_id: { $nin: [...userIds, sessionUserId] },
          }).lean();

          posts = [...interestPosts, ...remainingPosts, ...sessionUserPosts];
        } else {
          posts = await Posts.find({}).lean();
        }
      } else {
        posts = await Posts.find({}).lean();
      }
    }

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
