import express from "express";

import {
  createAgent,
  getAgents,
  deleteAgent
} from "../controllers/agentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAgent);

router.get("/", protect, getAgents);

router.delete("/:id", protect, deleteAgent)

export default router;