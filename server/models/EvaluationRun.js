import mongoose from "mongoose";

const evaluationRunSchema = new mongoose.Schema(
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

    input: {
      type: String,
      required: true,
      trim: true,
    },

    output: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    latency: {
      type: Number,
      required: true,
    },

    success: {
      type: Boolean,
      required: true,
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const EvaluationRun = mongoose.model(
  "EvaluationRun",
  evaluationRunSchema
);

export default EvaluationRun;