import express from "express";

import {
  getEvaluations,
} from "../controllers/evaluationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getEvaluations);

export default router;