import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const user = await User.findOne({ username: userId });
  try {
    return NextResponse.json({ message: user });
    // return NextResponse.json({ message: "Hello world" });
  } catch {
    return NextResponse.json({ message: "User Not found" });
  }
}
