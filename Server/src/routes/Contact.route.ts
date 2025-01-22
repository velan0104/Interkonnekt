import express from "express";
import { verifyToken } from "../middleware/Auth.middleware.js";
import { searchContact } from "../controllers/Contact.controllers.js";

const app = express.Router();

app.use(verifyToken);

app.post("/search", searchContact);

export default app;
