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
      // console.log("userId ai getposts: ",userId)
    }

    
    await dbConnect();

    let posts = [];

    if (userId) {
      
      posts = await Posts.find({ user_id: userId }).lean();
    } else {
     

      
      const sessionUserId = bodyText ? JSON.parse(bodyText).sessionUserId : null;
// console.log("sessionId at getpost: ",sessionUserId)
      if (sessionUserId) {
        
        const user = await User.findById(sessionUserId).select("interest").lean();
        // console.log("user at session: ",user)
        if (user && user.interest?.length > 0) {
         
          const usersWithSimilarInterests = await User.find({
            _id: { $ne: sessionUserId }, 
            interest: { $in: user.interest },
          })
            .select("_id")
            .lean();
      
          const userIds = usersWithSimilarInterests.map((u) => u._id);
          // console.log("Users with similar interests:", userIds);
      
          
          const interestPosts = await Posts.find({ user_id: { $in: userIds } }).lean();
          // console.log("Interest-based posts:", interestPosts);

           
    const sessionUserPosts = await Posts.find({ user_id: sessionUserId }).lean();
    // console.log("Session user posts:", sessionUserPosts);
      
         
          const remainingPosts = await Posts.find({
            user_id: { $nin: [...userIds, sessionUserId] },
          }).lean();
          // console.log("Remaining posts:", remainingPosts);
      
          
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
