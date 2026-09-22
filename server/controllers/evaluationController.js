import Agent from "../models/Agent.js";
import Dataset from "../models/Dataset.js";
import EvaluationBatch from "../models/EvaluationBatch.js";
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
export const runBatchEvaluation = async (req, res) => {
  const { agentId, datasetId } = req.body;

  let batch = null;

  try {
    if (!agentId || !datasetId) {
      return res.status(400).json({
        message: "Agent and dataset are required",
      });
    }

    // 1. Check agent belongs to logged-in user
    const agent = await Agent.findOne({
      _id: agentId,
      user: req.user._id,
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    // 2. Check dataset belongs to logged-in user
    const dataset = await Dataset.findOne({
      _id: datasetId,
      user: req.user._id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    // 3. Dataset should contain at least one test case
    if (!dataset.testCases.length) {
      return res.status(400).json({
        message: "Dataset has no test cases",
      });
    }

    // 4. Create batch record before running tests
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

    // 5. Run every dataset test case
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


        // Save successful individual run
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
        });

      } catch (error) {

        const latency =
          Date.now() - startTime;

        totalLatency += latency;
        failedRuns += 1;


        // Save failed individual run
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
        });
      }
    }


    // 6. Calculate batch average latency
    const averageLatency =
      dataset.testCases.length > 0
        ? Math.round(
            totalLatency /
              dataset.testCases.length
          )
        : 0;


    // 7. Update batch summary
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


    // 8. Return final batch result
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