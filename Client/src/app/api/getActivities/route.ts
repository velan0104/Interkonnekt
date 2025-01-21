import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        await dbConnect();
        const {userId} = await req.json();
        console.log("userid at get activities: ",userId)
        const activities = (await Activity.find({id:userId})).sort((a, b) => b.timestamp - a.timestamp);
        console.log("activities at get: ",activities)
        return NextResponse.json({activities},{status:200});
    }catch(error){
        console.log("error: ",error);
        return NextResponse.json({message: "error fetching activities"},{status:500})
    }
}