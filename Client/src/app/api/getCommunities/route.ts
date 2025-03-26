import dbConnect from "@/lib/mongodb";
import { Community } from "@/models/Community.model";
import { NextResponse } from "next/server";


export async function POST(){
    try{
        await dbConnect();
        const communities  = await Community.find();
        console.log("communities at get: ",communities)
        return NextResponse.json({communities},{status:200});
    }catch(error){
        return NextResponse.json({message: "error fetching communities"},{status:500})
    }
}