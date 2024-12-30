import dbConnect from "@/lib/mongodb";
import Posts from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    await dbConnect();

    if(req.method === "POST"){
        const body = await req.json();
        const {user_id,newUsername,name,profileImage, content, image, poll } = body; 
        console.log("profile at createPost: ",profileImage) 
        console.log("username at createPost: ",newUsername) 

        try{
            const post = await Posts.create({user_id,newUsername,name,profileImage,content,image,poll})
            console.log("post uploaded successfully")
            await post.save();
            return NextResponse.json({message: "Post uploaded successfully"}, {status: 201})
        }catch(error){
            return NextResponse.json({message: "Internal server error"},{status:500})
        }
    }
    return NextResponse.json({message: "method not allowed"}, {status:405})
}