import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import Posts from "@/models/post";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(req:NextRequest){
    try{
        await dbConnect();
        console.log("add activity api called")
        const {id,post_id,type,user,text} = await req.json();
        console.log("post id at get activity: ",post_id);
        console.log(" id at get activity: ",id);
        console.log("type at get activity: ",type);
        console.log("user id at get activity: ",user);
        console.log("text id at get activity: ",text);
        const postIdString = post_id.toString();
        const postIdObject = new mongoose.Types.ObjectId(postIdString);

        const post = await Posts.find(postIdObject);
        post.map((post) => {
            post.likes.forEach(async(element:any) => {
                console.log("element userId: ",element.userId)
                console.log("element id: ",id)
               if(element.userId != id) {
                const newActivity = new Activity({id,post_id,type,user,text});
                console.log("new activity created")
                await newActivity.save();
               }
            });
        })
        // const newActivity = new Activity({id,post_id,type,user,text});
        // await newActivity.save();
        return NextResponse.json({message:"activity uploaded successfully"},{status:200})
    }catch(error){
        console.log("error: ",error);
        return NextResponse.json({message:"error uploading activities"},{status:500})
    }
}