import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { currentUserId, targetUserId } = await req.json();
  // const url = new URL(req.url);
  // const userId = url.searchParams.get('userId');
  // console.log("Current user ID at follow:", currentUserId);
  // console.log("Target user ID at follow:", targetUserId);
  if (!currentUserId) {
    return NextResponse.json({ message: "Current user ID is required" }, { status: 400 });
  }

  await dbConnect();
//console.log("follow api called");
  const targetUser = await User.findOne({id:targetUserId});
  const currentUser = await User.findOne({id:currentUserId});

  // console.log("Target user:", targetUser);
  // console.log("Current user:", currentUser);

  if (!targetUser || !currentUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  currentUser.following = currentUser.following || [];
  targetUser.followers = targetUser.followers || [];

  const alreadyFollowing = currentUser.following.some(
    (following: { userId: string }) => following.userId === targetUser.id
  );

  if (alreadyFollowing) {
    // Unfollow: remove targetUser from currentUser's following and currentUser from targetUser's followers
    currentUser.following = currentUser.following.filter(
      (following: { userId: string }) => following.userId !== targetUser.id
    );
    targetUser.followers = targetUser.followers.filter(
      (follower: { userId: string }) => follower.userId !== currentUser.id
    );
  } else {
    // Follow: add targetUser to currentUser's following and currentUser to targetUser's followers
    currentUser.following.push({ userId: targetUser.id });
    targetUser.followers.push({ userId: currentUser.id });
  }
// console.log("currentUser.following:", currentUser.following);
// console.log("targetUser.followers:", targetUser.followers);
// console.log("currentUser:", currentUser);
// console.log("targetUser:", targetUser);
  await currentUser.save();
  await targetUser.save();

  return NextResponse.json({ message: "Follow status updated" }, { status: 200 });
}
