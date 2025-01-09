import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { currentUserId } = await req.json();
  
  if (!currentUserId) {
    return NextResponse.json({ message: "Current user ID is required" }, { status: 400 });
  }

  await dbConnect();

  const targetUser = await User.findById(params.userId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (currentUser.following.includes(targetUser._id)) {
    currentUser.following = currentUser.following.filter(
      (id: string) => id.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (id: string) => id.toString() !== currentUser._id.toString()
    );
  } else {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
  }

  await currentUser.save();
  await targetUser.save();

  return NextResponse.json({ message: "Follow status updated" }, { status: 200 });
}
