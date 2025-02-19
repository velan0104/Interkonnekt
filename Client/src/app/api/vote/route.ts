import dbConnect from "@/lib/mongodb";
import Posts from "@/models/post"; // Your Post model
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("vote called");
    const { postId, option, userId } = await req.json();
    console.log("postId at vote: ", postId);
    console.log("option at vote: ", option);
    console.log("userId at vote: ", userId);

    try {
        await dbConnect();

        // Find the post by ID
        const post = await Posts.findById(postId);
        console.log("post at vote: ", post);

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        // Find the poll
        const poll = post.poll[0]; // Assuming there is only one poll
        if (!poll) {
            return NextResponse.json({ message: "Poll not found" }, { status: 404 });
        }

        // Check if the user has already voted and for which option
        let userPreviouslyVotedOptionIndex = -1;

        poll.options.forEach((opt, index) => {
            if (opt.votes.includes(userId)) {
                userPreviouslyVotedOptionIndex = index;
            }
        });

        console.log("userPreviouslyVotedOptionIndex: ", userPreviouslyVotedOptionIndex);

        // Find the index of the selected option
        const selectedOptionIndex = poll.options.findIndex(o => o.optionValue === option);
        if (selectedOptionIndex === -1) {
            return NextResponse.json({ message: "Option not found" }, { status: 400 });
        }

        // If the user clicked the same option they already voted for, remove their vote (toggle behavior)
        if (userPreviouslyVotedOptionIndex === selectedOptionIndex) {
            poll.options[selectedOptionIndex].votes = poll.options[selectedOptionIndex].votes.filter((id) => id !== userId);
        } else {
            // Remove their vote from any previously selected option
            if (userPreviouslyVotedOptionIndex !== -1) {
                poll.options[userPreviouslyVotedOptionIndex].votes = poll.options[userPreviouslyVotedOptionIndex].votes.filter((id) => id !== userId);
            }
            // Add vote to the new option
            poll.options[selectedOptionIndex].votes.push(userId);
        }

        // Save the updated post
        await post.save();

        // Respond with the updated post
        return NextResponse.json({ message: "Vote updated", post });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
