import express from "express";

import {
  createDataset,
  getDatasets,
  getDatasetById,
  updateDataset,
  deleteDataset
} from "../controllers/datasetController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDataset);

router.get("/", protect, getDatasets);

router.get("/:id", protect, getDatasetById);

router.put("/:id", protect, updateDataset);

router.delete("/:id", protect, deleteDataset);

export default router;