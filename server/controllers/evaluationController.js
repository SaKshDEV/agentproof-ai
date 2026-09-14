import EvaluationRun from "../models/EvaluationRun.js";

export const getEvaluations = async (req, res) => {
  try {
    const evaluations = await EvaluationRun.find({
      user: req.user._id,
    })
      .populate("agent", "name method endpointUrl")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      evaluations,
    });

  } catch (error) {
    console.error(
      "Get evaluations error:",
      error.message
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};