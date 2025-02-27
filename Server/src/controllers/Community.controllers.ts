import { Response } from "express";
import { AuthenticatedRequest } from "../lib/type.js";
import { Community } from "../models/Community.model.js";
import { handleRequest } from "../lib/handleRequest.js";
import User from "../models/User.model.js";
import { Types } from "mongoose";
import CommunityPost from "../models/CommunityPost.model.js";
import Comment from "../models/Comments.model.js";

export const createCommunity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
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
        message:
          "There should be atleast 2 members while creating a community.",
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
  } catch (error) {
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

  const community = await Community.findById(id).populate(
    "members",
    "image username name"
  );
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

export const exploreCommunity = handleRequest(
  async (req, res): Promise<void> => {
    const userInterest = req.user?.interest;

    if (!userInterest || userInterest.length === 0) {
      res.status(400).json({ message: "No interest found for user" });
      return;
    }

    const communities = await Community.find({
      category: { $in: userInterest },
    }).populate("members", "image name username");

    res.status(200).json({ communities });
    return;
  }
);

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
  const user = await User.find(
    {
      _id: {
        $ne: userId,
      },
    },
    "username name image _id"
  );

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  res.status(200).json({ members: user });
});

export const createPost = handleRequest(
  async (req: AuthenticatedRequest, res: Response) => {
    const { content, media, title, category, community, poll } = req.body;

    console.log("CONTENT: ", content);
    console.log("MEDIA: ", media);
    console.log("POLL: ", poll);
    console.log(!content && (!media || media.length === 0) && !poll);

    if (!content && (!media || media.length === 0) && !poll) {
      res.status(400).json({ message: "Post cannot be empty." });
      return;
    }

    console.log("2");

    let response = null;

    if (poll) {
      const pollToSubmit = {
        question: poll.question,
        options: poll.options.map(
          (option: { text: string; votes: number }) => option.text
        ),
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
    } else {
      response = await CommunityPost.create({
        author: req.user?.id,
        community,
        title,
        category,
        content,
        media,
      });
    }

    console.log("3");

    if (!response) {
      throw { status: 500, message: "Internal server error" };
    }

    res.status(201).json({ post: response });
    return;
  }
);

export const getCommunityPosts = handleRequest(async (req, res) => {
  const { id } = req.query;

  const posts = await CommunityPost.find({ community: id }).populate(
    "author",
    "image name"
  );

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
  const userId = req.user?.id as Types.ObjectId;
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
    post.likes = post.likes.filter((id: Types.ObjectId) => id !== userId);
  } else {
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
