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
export const getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    return res.status(200).json({
      dataset,
    });

  } catch (error) {
    console.error(
      "Get dataset error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const updateDataset = async (req, res) => {
  try {
    const {
      name,
      description,
      testCases,
    } = req.body;

    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    if (name !== undefined) {
      dataset.name = name;
    }

    if (description !== undefined) {
      dataset.description = description;
    }

    if (testCases !== undefined) {
      dataset.testCases = testCases;
    }

    await dataset.save();

    return res.status(200).json({
      message: "Dataset updated successfully",
      dataset,
    });

  } catch (error) {
    console.error(
      "Update dataset error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};
export const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    await dataset.deleteOne();

    return res.status(200).json({
      message: "Dataset deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete dataset error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};