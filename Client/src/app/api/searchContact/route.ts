import User from "@/models/user";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const { searchTerm, userId } = await req.json();
  if (searchTerm === undefined || searchTerm === null)
    return res.status(200).send("Search Term is required");

  const sanitizedSearchTerm = searchTerm.replace(/[.**?^${}()\[\]\\]/g, "\\$&");
  const user = await User.findOne({ id: userId });

  const regex = new RegExp(sanitizedSearchTerm, "i");
  const response = await User.find({
    $and: [
      { _id: { $ne: user?._id } }, 
      {
        $or: [{ name: regex }, { username: regex }],
      },
    ],
  });
  try {
    return NextResponse.json({ message: response || "User not found" });
    // return NextResponse.json({ message: "Hello world" });
  } catch {
    return NextResponse.json({ message: "User Not found" });
  }
}
