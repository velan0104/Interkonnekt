import express from "express";
import { verifyToken } from "../middleware/Auth.middleware.js";
import { getMessage } from "../controllers/Message.controllers.js";
const app = express.Router();
app.use(verifyToken);
app.post("/getMessage", getMessage);
export default app;
