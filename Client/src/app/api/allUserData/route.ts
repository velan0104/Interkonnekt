import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Parse the JSON body
 

  try {
    // Connect to the database
    await dbConnect();

    // Check if a specific userId is provided
   

     
    
      // Fetch all users from the database
      // console.log("fetching all users")
      const allUsers = await User.find();

      // Return all users
      return NextResponse.json(
        {
          message: "All users fetched successfully",
          users: allUsers,
        },
        { status: 200 }
      );
    
  } catch (error) {
    console.error("Error in fetching user(s):", error);
    return NextResponse.json(
      { message: "An error occurred while fetching user(s)" },
      { status: 500 }
    );
  }
}
