import { Community } from "../models/Community.model.js";
import { handleRequest } from "../lib/handleRequest.js";
export const createCommunity = async (req, res) => {
    try {
        const { name, bio, members, admin, banner, category, profilePic } = req.body;
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
        if (members.length < 2) {
            res.status(500).json({
                message: "There should be atleast 2 members while creating a community.",
            });
            return;
        }
        const response = await Community.create({
            name,
            bio,
            admin,
            members,
            banner,
            category,
            profilePic,
        });
        console.log("Community created: ", response);
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
    console.log("Community ID: ", id);
    if (!id) {
        res.status(400).json({ message: "ID not found" });
        return;
    }
    const community = await Community.findById(id).populate("members", "image username");
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
    const communities = await Community.find({
        category: { $in: userInterest },
    }).populate("members", "image");
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
    const { query } = req.query; // Get search value from query params
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
