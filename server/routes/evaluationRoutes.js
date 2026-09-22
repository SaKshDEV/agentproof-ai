import express from "express";

import {
  getEvaluations,
  runBatchEvaluation
} from "../controllers/evaluationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getEvaluations);
router.post("/batch",protect,runBatchEvaluation);

export default router;