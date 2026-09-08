import express from "express";

import {
  createAgent,
  getAgents,
} from "../controllers/agentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAgent);

router.get("/", protect, getAgents);

export default router;