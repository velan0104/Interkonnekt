
import type { NextApiRequest, NextApiResponse } from 'next';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Posts from '@/models/post';

export async function POST(req: NextRequest) {
 
    const { postId, userId,content } = await req.json();

    console.log("postId at comment route: ",postId)
      console.log("userId at comment route: ",userId)
      console.log("comment at comment route: ",content)
      if (!postId || !userId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
      }

   
    try {
     await dbConnect();
      const result = await Posts.findById(postId)
     
      if (!result) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      result.comments.push({  post_id: postId,userId:userId,content:content });
      result.commentCount += 1; 
      await result.save();

      
     
      const formattedComments = result.comments.map(comment => ({
        post_id: comment.post_id.toString(),
        userId: comment.userId,
        content: comment.content,
        _id: comment._id.toString(),
        createdAt: comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString(),
      }));
      console.log("formatted at like route: ",formattedComments)
      
      return NextResponse.json({ comments: formattedComments }, { status: 200 });
      
     
    } catch (error) {
        return NextResponse.json({error: "Error adding comment"}, { status: 500 });
      
    }
 
}
