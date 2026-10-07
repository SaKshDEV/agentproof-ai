import mongoose from "mongoose";

const evaluationBatchSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
      },

      dataset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dataset",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "running",
          "completed",
          "failed",
        ],
        default: "running",
      },

      totalTests: {
        type: Number,
        default: 0,
      },

      successfulRuns: {
        type: Number,
        default: 0,
      },

      failedRuns: {
        type: Number,
        default: 0,
      },
      evaluatedTests: {
        type: Number,
        default: 0,
      },
      passedEvaluations: {
        type: Number,
        default: 0,
      },
      failedEvaluations: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: null,
      },

      correctnessRate: {
        type: Number,
        default: null,
      },

      averageLatency: {
        type: Number,
        default: 0,
      },

      completedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const EvaluationBatch =
  mongoose.model(
    "EvaluationBatch",
    evaluationBatchSchema
  )

export default EvaluationBatch;