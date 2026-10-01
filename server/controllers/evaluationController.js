import Agent from "../models/Agent.js";
import Dataset from "../models/Dataset.js";
import EvaluationBatch from "../models/EvaluationBatch.js";
import EvaluationRun from "../models/EvaluationRun.js";
import {
  evaluateNormalizedExact,
} from "../services/evaluationService.js";


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


export const runBatchEvaluation = async (req, res) => {
  const { agentId, datasetId } = req.body;

  let batch = null;

  try {
    if (!agentId || !datasetId) {
      return res.status(400).json({
        message: "Agent and dataset are required",
      });
    }

    const agent = await Agent.findOne({
      _id: agentId,
      user: req.user._id,
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user._id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    if (!dataset.testCases.length) {
      return res.status(400).json({
        message: "Dataset has no test cases",
      });
    }

    batch = await EvaluationBatch.create({
      user: req.user._id,
      agent: agent._id,
      dataset: dataset._id,
      status: "running",
      totalTests: dataset.testCases.length,
    });

    let successfulRuns = 0;
    let failedRuns = 0;
    let totalLatency = 0;

    const results = [];

    for (const testCase of dataset.testCases) {
      const startTime = Date.now();

      try {
        let agentResponse;

        if (agent.method === "POST") {
          const response = await fetch(
            agent.endpointUrl,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                input: testCase.input,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Agent returned status ${response.status}`
            );
          }

          agentResponse =
            await response.json();

        } else {
          const url = new URL(
            agent.endpointUrl
          );

          url.searchParams.set(
            "input",
            testCase.input
          );

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(
              `Agent returned status ${response.status}`
            );
          }

          agentResponse =
            await response.json();
        }

        const latency =
          Date.now() - startTime;

        totalLatency += latency;
        successfulRuns += 1;

        const evaluation =
          evaluateNormalizedExact(
            testCase.expectedOutput || "",
            agentResponse
          );

        const evaluationRun =
          await EvaluationRun.create({
            user: req.user._id,

            agent: agent._id,

            dataset: dataset._id,

            batch: batch._id,

            testCaseId:
              testCase._id,

            input:
              testCase.input,

            expectedOutput:
              testCase.expectedOutput || "",

            output:
              agentResponse,

            latency,

            success: true,

            error: "",

            evaluation,
          });

        results.push({
          evaluationId:
            evaluationRun._id,

          testCaseId:
            testCase._id,

          input:
            testCase.input,

          expectedOutput:
            testCase.expectedOutput || "",

          output:
            agentResponse,

          latency,

          success: true,

          error: "",

          evaluation,
        });

      } catch (error) {
        const latency =
          Date.now() - startTime;

        totalLatency += latency;
        failedRuns += 1;

        const failedEvaluation = {
          method: "none",
          score: null,
          passed: null,
          reason:
            "Agent execution failed before the response could be evaluated.",
        };

        const evaluationRun =
          await EvaluationRun.create({
            user: req.user._id,

            agent: agent._id,

            dataset:
              dataset._id,

            batch:
              batch._id,

            testCaseId:
              testCase._id,

            input:
              testCase.input,

            expectedOutput:
              testCase.expectedOutput || "",

            output: null,

            latency,

            success: false,

            error:
              error.message,

            evaluation:
              failedEvaluation,
          });

        results.push({
          evaluationId:
            evaluationRun._id,

          testCaseId:
            testCase._id,

          input:
            testCase.input,

          expectedOutput:
            testCase.expectedOutput || "",

          output: null,

          latency,

          success: false,

          error:
            error.message,

          evaluation:
            failedEvaluation,
        });
      }
    }

    const averageLatency =
      dataset.testCases.length > 0
        ? Math.round(
          totalLatency /
          dataset.testCases.length
        )
        : 0;

    batch.status = "completed";

    batch.successfulRuns =
      successfulRuns;

    batch.failedRuns =
      failedRuns;

    batch.averageLatency =
      averageLatency;

    batch.completedAt =
      new Date();

    await batch.save();

    return res.status(200).json({
      message:
        "Batch evaluation completed",

      batch: {
        _id: batch._id,

        agent: agent.name,

        dataset: dataset.name,

        totalTests:
          dataset.testCases.length,

        successfulRuns,

        failedRuns,

        averageLatency,

        status:
          batch.status,
      },

      results,
    });

  } catch (error) {
    console.error(
      "Batch evaluation error:",
      error.message
    );

    if (batch) {
      try {
        batch.status = "failed";

        batch.completedAt =
          new Date();

        await batch.save();

      } catch (batchError) {
        console.error(
          "Batch status update failed:",
          batchError.message
        );
      }
    }

    return res.status(500).json({
      message:
        "Batch evaluation failed",

      error:
        error.message,
    });
  }
};