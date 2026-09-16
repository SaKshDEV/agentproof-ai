import express from "express";

import {
  createDataset,
  getDatasets,
} from "../controllers/datasetController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDataset);

router.get("/", protect, getDatasets);

export default router;