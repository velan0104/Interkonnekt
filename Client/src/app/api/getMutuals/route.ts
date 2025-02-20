import User from "@/models/user";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const { userId } = await req.json();

  try {
    const user = await User.findById(userId).select("followers following");
    const connections = [...user.followers, ...user.following];
    const uniqueConnections = connections.filter(
      (obj, index, self) =>
        index === self.findIndex((o) => o.userId === obj.userId)
    );
    return NextResponse.json({ message: uniqueConnections });
    // return NextResponse.json({ message: "Hello world" });
  } catch {
    return NextResponse.json({ message: "User Not found" });
  }
}
