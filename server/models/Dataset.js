import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
    {
        input:{
            type: String,
            required: true,
            trim: true,
        },
        expectedOutput:{
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        _id: true,
    }
);

const datasetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    testCases: {
      type: [testCaseSchema],
      default: [],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dataset = mongoose.model(
  "Dataset",
  datasetSchema
);

export default Dataset;