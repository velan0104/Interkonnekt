import express from "express";
import { verifyToken } from "../middleware/Auth.middleware.js";
import { getContactForDMList } from "../controllers/Contact.controllers.js";

const app = express.Router();

// app.post("/search", searchContact);
app.get("/getContacts", verifyToken, getContactForDMList);

export default app;
