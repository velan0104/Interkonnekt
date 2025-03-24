import express from "express";
import { verifyToken } from "../middleware/Auth.middleware.js";
import {
  addParticipant,
  createWorkshop,
  getCommunityWorkshops,
  getMeetingLink,
  getWorkshopPostByID,
  startWorkshop,
  updateWorkshopPost,
  workshopCompletion,
} from "../controllers/Workshop.controllers.js";

const app = express.Router();

app.use(verifyToken);
app.post("/createWorkshop", createWorkshop);
app.post("/upateWorkshopPost", updateWorkshopPost);
app.post("/workshopCompletion", workshopCompletion);
app.get("/getWorkshopPost/:workshopId", getWorkshopPostByID);
app.get("/community/:communityId", getCommunityWorkshops);
app.put("/start", startWorkshop);
app.put("/addParticipant", addParticipant);
app.get("/meetingLink/:workshopId", getMeetingLink);
export default app;
