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

        
        
        if(type == 'like'){
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
    }
    if(type == 'comment'){
        const postIdString = post_id.toString();
        const postIdObject = new mongoose.Types.ObjectId(postIdString);

        const post = await Posts.find(postIdObject);
        post.map(async(post) => {
            
                console.log("element userId: ",post.user_id)
                console.log("element id: ",id)
               if(post.user_id != id) {
                const newActivity = new Activity({id,post_id,type,user,text});
                console.log("comment new activity created")
                await newActivity.save();
               }
            
        })
    }
        const newActivity = new Activity({id,type,user,text});
        console.log("activity in else: ",newActivity);
        await newActivity.save();
        return NextResponse.json({message:"activity uploaded successfully"},{status:200})
    }catch(error){
        console.log("error: ",error);
        return NextResponse.json({message:"error uploading activities"},{status:500})
    }
}