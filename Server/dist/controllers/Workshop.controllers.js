import { Workshop } from "../models/Workshop.model.js";
import { handleRequest } from "../lib/handleRequest.js";
import CommunityPost from "../models/CommunityPost.model.js";
import { Types } from "mongoose";
export const createWorkshop = handleRequest(async (req, res) => {
    const { title, description, host, startTime, category, bannerImage, maxParticipants, communityId, } = await req.body;
    const overlappingWorkshop = await Workshop.findOne({
        category,
        startTime: {
            $lte: new Date(new Date(startTime).getTime() + 1 * 60 * 60 * 1000),
        },
        endTime: { $gte: new Date(startTime) },
        isCompleted: false,
    });
    if (overlappingWorkshop) {
        res.status(400).json({
            message: "A workshop in the same category is already scheduled at this time.",
        });
        return;
    }
    const workshop = await Workshop.create({
        title,
        description,
        host: req.user?.id,
        startTime,
        category,
        bannerImage,
        maxParticipants,
    });
    if (!workshop) {
        throw { status: 400, message: "Failed to create workshop" };
    }
    const communityPost = await CommunityPost.create({
        title: `🎉 New Workshop: ${workshop.title}`,
        content: workshop.description,
        author: workshop.host,
        community: communityId,
        isPinned: true, // Pin the post to the top of the community feed
        isWorkshop: true,
        workshopId: workshop._id,
    });
    if (!communityPost) {
        throw { status: 400, message: "Post not created" };
    }
    res.status(201).json({ message: "Workshop created" });
    return;
});
export const updateWorkshopPost = handleRequest(async (req, res) => {
    const { postId } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(postId, { title: "🎉 Workshop is Live! Join Now", isPinned: true }, { new: true });
    if (!post) {
        throw { status: 400, message: "Post not found" };
    }
    res.status(200).json({ message: "Post updated successfully" });
    return;
});
export const workshopCompletion = handleRequest(async (req, res) => {
    const { workshopId } = req.body;
    const workshop = await Workshop.findByIdAndUpdate(workshopId, { isCompleted: true, endTime: new Date() }, { new: true });
    if (!workshop) {
        throw { status: 400, message: "Workshop not found" };
        return;
    }
    // Unpin the community post
    const communityPost = await CommunityPost.findOneAndUpdate({ workshopId: workshop._id }, { isPinned: false });
    if (!communityPost) {
        throw { status: 400, message: "Cannot find community post" };
        return;
    }
    res.status(200).json({ message: "Post updated successfully" });
    return;
});
export const getWorkshopPostByID = handleRequest(async (req, res) => {
    const { workshopId } = req.params;
    const workshop = await Workshop.findById(workshopId).populate("host", "name image");
    if (!workshop) {
        throw { status: 400, message: "Workshop not found" };
        return;
    }
    res.status(200).json({ data: workshop });
});
export const getCommunityWorkshops = handleRequest(async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const currentDate = new Date();
    const hostedUpcomingWorkshops = await Workshop.find({
        host: userId,
        // startTime: { $gte: currentDate }, // Upcoming workshops
        // isStarted: false,
        isCompleted: false,
    }).populate("host", "name");
    // Fetch upcoming workshops in the community (direct DB filtering)
    const communityUpcomingWorkshops = await CommunityPost.find({
        community: communityId,
        isWorkshop: true,
    })
        .populate({
        path: "workshopId",
        match: { isCompleted: false },
        populate: { path: "host", select: "name" },
    })
        .then((posts) => posts.map((post) => post.workshopId).filter(Boolean)); // Remove null values4
    const completedWorkshops = await CommunityPost.find({
        community: communityId,
        isWorkshop: true,
    })
        .populate({
        path: "workshopId",
        match: { isCompleted: true },
        populate: { path: "host", select: "name" },
    })
        .then((posts) => posts.map((post) => post.workshopId).filter(Boolean));
    res.status(200).json({
        hostedUpcomingWorkshops,
        communityUpcomingWorkshops,
        completedWorkshops,
    });
    return;
});
export const startWorkshop = handleRequest(async (req, res) => {
    const { meetingLink, workshopId } = req.body;
    if (!meetingLink) {
        res.status(400).json({ message: "Meeting link is required" });
        return;
    }
    const updatedWorkshop = await Workshop.findByIdAndUpdate(workshopId, { meetingLink, isStarted: true }, { new: true });
    if (!updatedWorkshop) {
        res.status(404).json({ message: "Workshop not found" });
        return;
    }
    res
        .status(200)
        .json({ message: "Workshop started", workshop: updatedWorkshop });
    return;
});
export const getMeetingLink = handleRequest(async (req, res) => {
    const { workshopID } = req.params;
    const meetingLink = await Workshop.findById(workshopID, "meetingLink");
    if (!meetingLink) {
        res.status(401).json({ message: "No workshop found" });
        return;
    }
    res.status(200).json({ meetingLink: meetingLink });
    return;
});
export const addParticipant = handleRequest(async (req, res) => {
    const { workshopId } = req.body;
    const userId = new Types.ObjectId(req.user?.id);
    if (!workshopId) {
        res.status(400).json({ message: "ID not found" });
        return;
    }
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
        res.status(404).json({ message: "Workshop not found" });
        return;
    }
    if (workshop.participants.includes(userId)) {
        res.status(400).json({ message: "You are already a participant" });
        return;
    }
    workshop.participants.push(userId);
    await workshop.save();
    res
        .status(200)
        .json({ message: "successfully joined the workshop", workshop });
    return;
});
