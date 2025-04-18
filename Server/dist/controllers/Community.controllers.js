import { Community } from "../models/Community.model.js";
import { handleRequest } from "../lib/handleRequest.js";
import User from "../models/User.model.js";
import { Types } from "mongoose";
import CommunityPost from "../models/CommunityPost.model.js";
import Comment from "../models/Comments.model.js";
export const createCommunity = async (req, res) => {
    try {
        const { name, bio, members, banner, category, profilePic } = req.body;
        const userCommunityCount = await Community.find({
            admin: req.user?.id,
        });
        const uniqueCommunityName = await Community.find({
            name: name,
        });
        if (userCommunityCount.length > 2) {
            res.status(500).json({
                message: "One user can reate only 3 community",
            });
            return;
        }
        if (uniqueCommunityName.length > 1) {
            res.status(500).json({
                message: "Community name is already there",
            });
            return;
        }
        if (members.length <= 2) {
            res.status(500).json({
                message: "There should be atleast 2 members while creating a community.",
            });
            return;
        }
        const response = await Community.create({
            name,
            bio,
            admin: req.user?.id,
            members,
            banner,
            category,
            profilePic,
        });
        res.status(200).json({ response });
        return;
    }
    catch (error) {
        res.status(500).send("Internal server error");
        return;
    }
};
export const getCommunityInfo = handleRequest(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "ID not found" });
        return;
    }
    const community = await Community.findById(id)
        .populate("members", "image username name")
        .populate("admin", "image username name");
    res.status(200).json({ community });
    return;
});
export const userCommunity = handleRequest(async (req, res) => {
    const userId = req.user?.id;
    const communities = await Community.find({
        $or: [{ admin: userId }, { members: { $in: [userId] } }],
    });
    res.status(200).json({ communities });
    return;
});
export const exploreCommunity = handleRequest(async (req, res) => {
    const userInterest = req.user?.interest;
    if (!userInterest || userInterest.length === 0) {
        res.status(400).json({ message: "No interest found for user" });
        return;
    }
    let communities = await Community.find({
        category: { $in: userInterest },
    }).populate("members", "image name username");
    if (communities.length === 0) {
        communities = await Community.find()
            .limit(5)
            .populate("members", "image name username");
    }
    res.status(200).json({ communities });
    return;
});
export const communityFeed = handleRequest(async (req, res) => {
    const userId = req.user?.id;
    const communityPost = await Community.find({
        $or: [{ admin: userId }, { members: { $in: [userId] } }],
    });
    res.status(200).json({ communityPost });
    return;
});
export const searchCommunity = handleRequest(async (req, res) => {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    const communities = await Community.find({
        name: { $regex: query, $options: "i" },
    });
    res.status(200).json({ communities });
    return;
});
export const getMember = handleRequest(async (req, res) => {
    const userId = req.user?.id;
    // Fetch user and populate followers & following with userId, username, profilePic
    const user = await User.find({
        _id: {
            $ne: userId,
        },
    }, "username name image _id");
    if (!user) {
        throw { status: 404, message: "User not found" };
    }
    res.status(200).json({ members: user });
});
export const addMember = handleRequest(async (req, res) => {
    const userId = req.user?.id;
    const { communityId } = req.body;
    if (!communityId || !userId) {
        res.status(400).json({ message: "communityId and userId are required" });
        return;
    }
    const community = await Community.findById(communityId);
    if (!community) {
        res.status(404).json({ message: "Community not found" });
        return;
    }
    if (!community.members.includes(new Types.ObjectId(userId))) {
        community.members.push(new Types.ObjectId(userId));
        await community.save();
        res.status(200).json({ message: "User added to community", community });
        return;
    }
    else {
        res
            .status(400)
            .json({ message: "User is already a member of this community" });
        return;
    }
});
export const removeMember = handleRequest(async (req, res) => {
    const { communityId, memberId } = req.params;
    const updatedCommunity = await Community.findByIdAndUpdate(communityId, { $pull: { members: memberId } }, { new: true });
    if (!updatedCommunity) {
        res.status(404).json({ message: "Community not found" });
        return;
    }
    res.json({ message: "Member removed successfully", updatedCommunity });
    return;
});
export const createPost = handleRequest(async (req, res) => {
    const { content, media, title, category, community, poll } = req.body;
    console.log("CONTENT: ", content);
    console.log("MEDIA: ", media);
    console.log("POLL: ", poll);
    console.log(!content && (!media || media.length === 0) && !poll);
    if (!content && (!media || media.length === 0) && !poll) {
        res.status(400).json({ message: "Post cannot be empty." });
        return;
    }
    let response = null;
    if (poll) {
        const pollToSubmit = {
            question: poll.question,
            options: poll.options.map((option) => option.text),
            endDate: poll.endDate,
        };
        console.log(pollToSubmit);
        response = await CommunityPost.create({
            author: req.user?.id,
            community,
            title,
            category,
            content,
            media,
            pollToSubmit,
        });
    }
    else {
        response = await CommunityPost.create({
            author: req.user?.id,
            community,
            title,
            category,
            content,
            media,
        });
    }
    if (!response) {
        throw { status: 500, message: "Internal server error" };
    }
    res.status(201).json({ post: response });
    return;
});
export const getCommunityPosts = handleRequest(async (req, res) => {
    const { id } = req.query;
    const posts = await CommunityPost.find({ community: id }).populate("author", "image name");
    if (!posts) {
        throw { status: 400, message: "Post not found" };
    }
    res.status(200).json({ posts: posts });
});
export const getAllPosts = handleRequest(async (req, res) => {
    const userId = req.user?.id;
    const userCommunities = await Community.find({
        $or: [{ members: userId }, { admin: userId }],
    }).select("_id");
    const communityIds = userCommunities.map((community) => community._id);
    const posts = await CommunityPost.find({
        community: { $in: communityIds },
    })
        .populate("author", "image name")
        .populate("community", "name")
        .sort({ createdAt: -1 })
        .exec();
    if (!posts) {
        throw { status: 400, message: "Internal server error" };
    }
    res.status(200).json({ posts: posts });
    return;
});
export const likePost = handleRequest(async (req, res) => {
    const userId = req.user?.id;
    const { postId } = req.body;
    if (!postId) {
        throw { status: 400, message: "Post ID is required" };
    }
    const post = await CommunityPost.findById(postId);
    if (!post) {
        throw { status: 404, message: "Post not found" };
    }
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id !== userId);
    }
    else {
        post.likes.push(userId);
    }
    await post.save();
    res.status(200).json({
        message: alreadyLiked ? "Post unliked" : "Post liked",
        likesCount: post.likes.length,
    });
});
export const addComment = handleRequest(async (req, res) => {
    const userId = req.user?.id;
    const { postId, content } = req.body;
    if (!postId || !content) {
        throw { status: 400, message: "Post ID and content are required" };
    }
    const post = await CommunityPost.findById(postId);
    if (!post) {
        throw { status: 404, message: "Post not found" };
    }
    const newComment = new Comment({
        content,
        author: userId,
        post: postId,
    });
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.status(201).json({
        message: "Comment added successfully",
        comment: newComment,
    });
});
export const getPostWithComments = handleRequest(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "ID not found" });
        return;
    }
    const postData = await CommunityPost.findById(id).populate("comments");
    if (!postData) {
        throw { status: 400, message: "Post not found" };
    }
    res.status(200).json({ data: postData });
});
