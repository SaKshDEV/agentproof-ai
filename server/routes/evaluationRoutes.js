import express from "express";

import {
  getEvaluations,
  getEvaluationBatches,
  getEvaluationBatchById,
  runBatchEvaluation,
  
} from "../controllers/evaluationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getEvaluations);
router.get("/batches",protect,getEvaluationBatches);
router.get("/batches/:id",protect, getEvaluationBatchById );
router.post("/batch",protect,runBatchEvaluation);

export default router;