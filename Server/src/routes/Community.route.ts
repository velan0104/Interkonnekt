import express from "express";
import { verifyToken } from "../middleware/Auth.middleware.js";
import {
  createCommunity,
  exploreCommunity,
  getCommunityInfo,
  searchCommunity,
  userCommunity,
} from "../controllers/Community.controllers.js";

const app = express.Router();

app.use(verifyToken);

app.post("/create", createCommunity);
app.get("/info/:id", getCommunityInfo);
app.get("/explore", exploreCommunity);
app.get("/getCommunity", userCommunity);
app.get("/search", searchCommunity);

export default app;
