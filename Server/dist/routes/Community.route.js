import express from "express";
import { verifyToken } from "../middleware/Auth.middleware.js";
import { addComment, createCommunity, createPost, exploreCommunity, getAllPosts, getCommunityInfo, getCommunityPosts, getMember, getPostWithComments, likePost, searchCommunity, userCommunity, } from "../controllers/Community.controllers.js";
const app = express.Router();
app.use(verifyToken);
app.post("/create", createCommunity);
app.get("/info/:id", getCommunityInfo);
app.get("/explore", exploreCommunity);
app.get("/getCommunity", userCommunity);
app.get("/search", searchCommunity);
app.get("/getMember", getMember);
app.post("/createPost", createPost);
app.get("/getCommunityPosts", getCommunityPosts);
app.get("/getAllPosts", getAllPosts);
app.post("/likePost", likePost);
app.post("/addComment", addComment);
app.get("/getPostWithComments/:id", getPostWithComments);
export default app;
