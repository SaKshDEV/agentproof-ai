import Dataset from "../models/Dataset.js";

export const createDataset = async (req, res) => {
  try {
    const {
      name,
      description,
      testCases,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Dataset name is required",
      });
    }

    const dataset = await Dataset.create({
      name,
      description,
      testCases: testCases || [],
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Dataset created successfully",
      dataset,
    });

  } catch (error) {
    console.error(
      "Create dataset error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


export const getDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      datasets,
    });

  } catch (error) {
    console.error(
      "Get datasets error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};