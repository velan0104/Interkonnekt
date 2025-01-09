import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { currentUserId, targetUserId } = await req.json();
//   const url = new URL(req.url);
//   const userId = url.searchParams.get('userId');
  // console.log("Current user ID at unfollow:", currentUserId);
  // console.log("Target user ID at unfollow:", targetUserId);
  if (!currentUserId) {
    return NextResponse.json({ message: "Current user ID is required" }, { status: 400 });
  }
try{
  await dbConnect();
//console.log("unfollow api called");
  const targetUser = await User.findOne({id:targetUserId});
  const currentUser = await User.findOne({id:currentUserId});

  if (!targetUser || !currentUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await User.findOneAndUpdate({id:currentUserId}, {
    $pull: { following: {userId: targetUserId } },
  });

  await User.findOneAndUpdate({id:targetUserId}, {
    $pull: { followers: { userId: currentUserId } },
  });  

  await currentUser.save();
  await targetUser.save();

  return NextResponse.json({ message: "user unfollowed successfully" }, { status: 200 });
}catch(error){
    console.error("Error updating follow status:", error);
    return NextResponse.json(
        { message: "Failed to update follow status", error: error },
        { status: 500 }
    );
}
}
