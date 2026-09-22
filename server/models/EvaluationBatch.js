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