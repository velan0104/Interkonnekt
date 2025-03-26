import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchTerm } = await req.json();

  try {
    await dbConnect();

    const searchCriteria = searchTerm
      ? {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { interest: { $regex: searchTerm, $options: "i" } },
          ],
        }
      : {};
    const results = await User.find(searchCriteria).limit(50);
    return NextResponse.json(
      { message: results || "No results found" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
