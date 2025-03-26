import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import Posts from "@/models/post";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { id, interest, email, profileImage, username } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  if (!id) {
    console.warn("id is missing");
  }
  if (!profileImage) {
    console.warn("Profile image is missing");
  }

  await dbConnect();

  const existingUsername = await User.findOne({ $or: [{ email }, { id }] });
  const existingUser2 = await Posts.find({ user_id: id });

  if (!existingUsername) {
    return NextResponse.json(
      { message: "User with this email does not exist" },
      { status: 400 }
    );
  }
  if (profileImage) {
    existingUsername.image = profileImage;
    existingUser2.profileImage = profileImage;
  }
  if (username) {
    existingUsername.username = username;
  }
  if (interest) {
    const interestsArray =
      typeof interest === "string" ? interest.split(",") : interest;
    existingUsername.interest = interestsArray;
  }
  await existingUsername.save();

  for (const post of existingUser2) {
    if (profileImage) {
      post.profileImage = profileImage;
    }
    await post.save();
  }

  return NextResponse.json(
    { message: "profile updated successfully", existingUsername },
    { status: 200 }
  );
}
