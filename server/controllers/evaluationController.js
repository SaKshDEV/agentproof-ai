import Agent from "../models/Agent.js";
import Dataset from "../models/Dataset.js";
import EvaluationBatch from "../models/EvaluationBatch.js";
import EvaluationRun from "../models/EvaluationRun.js";
import {
  evaluateNormalizedExact,
  evaluateTokenSimilarity,
} from "../services/evaluationService.js";
import {
  evaluateSemanticMeaning
} from "../services/semanticEvaluationService.js";
import {
  validateAgentUrl
} from "../services/agentUrlSecurityService.js";
import {
  decryptCredential,
} from "../services/credentialEncryptionService.js";
import {
  validateAuthHeaderName,
} from "../services/agentAuthSecurityService.js";


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
export const getEvaluationBatches = async (
  req,
  res
) => {
  try {
    const batches = await EvaluationBatch.find({
      user: req.user._id,
    })
      .populate(
        "agent",
        "name method endpointUrl"
      )
      .populate(
        "dataset",
        "name description"
      )
      .sort({
        createdAt: -1,
      });
    return res.status(200).json({
      batches,
    });

  } catch (error) {
    console.error(
      "Get evaluation batches error:",
      error.message
    );
    return res.status(500).json({
      message:
        "Failed to load evaluation batches",
    });
  }
};

export const getEvaluationBatchById = async (req, res) => {
  try {
    const batch = await EvaluationBatch.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
      .populate(
        "agent",
        "name method endpointUrl"
      )
      .populate(
        "dataset",
        "name description"
      );
    if (!batch) {
      return res.status(404).json({
        message:
          "Evaluation batch not found",
      });
    }

    const runs =
      await EvaluationRun.find({
        batch: batch._id,
        user: req.user._id,
      }).sort({
        createdAt: 1,
      });

    return res.status(200).json({
      batch,
      runs,
    });

  } catch (error) {
    console.error(
      "Get evaluation batch error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to load evaluation batch",
    });
  }
};

export const compareEvaluationBatches = async (req, res) => {
  try {
    const {
      baselineBatchId,
      currentBatchId,
    } = req.body;

    if (
      !baselineBatchId ||
      !currentBatchId
    ) {
      return res.status(400).json({
        message: "Baseline batch and current batch are required"
      });
    }
    if (
      baselineBatchId ===
      currentBatchId
    ) {
      return res.status(400).json({
        message:
          "Choose two different batches to compare",
      });
    }


    const baselineBatch =
      await EvaluationBatch.findOne({
        _id: baselineBatchId,
        user: req.user._id,
      })
        .populate(
          "agent",
          "name method endpointUrl"
        )
        .populate(
          "dataset",
          "name description"
        );


    const currentBatch =
      await EvaluationBatch.findOne({
        _id: currentBatchId,
        user: req.user._id,
      })
        .populate(
          "agent",
          "name method endpointUrl"
        )
        .populate(
          "dataset",
          "name description"
        );


    if (
      !baselineBatch ||
      !currentBatch
    ) {
      return res.status(404).json({
        message:
          "One or both evaluation batches were not found",
      });
    }
    if (
      !baselineBatch.dataset ||
      !currentBatch.dataset
    ) {
      return res.status(400).json({
        message:
          "One or both datasets are no longer available",
      });
    }


    if (
      baselineBatch.dataset._id.toString() !==
      currentBatch.dataset._id.toString()
    ) {
      return res.status(400).json({
        message:
          "Only batches using the same dataset can be compared",
      });
    }


    const baselineRuns =
      await EvaluationRun.find({
        batch: baselineBatch._id,
        user: req.user._id,
      }).sort({
        createdAt: 1,
      });


    const currentRuns =
      await EvaluationRun.find({
        batch: currentBatch._id,
        user: req.user._id,
      }).sort({
        createdAt: 1,
      });


    const normalizeInput = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");


    const baselineByTestCaseId =
      new Map();

    const baselineByInput =
      new Map();


    for (const run of baselineRuns) {
      if (run.testCaseId) {
        baselineByTestCaseId.set(
          run.testCaseId.toString(),
          run
        );
      }

      baselineByInput.set(
        normalizeInput(run.input),
        run
      );
    }


    let regressions = 0;
    let improvements = 0;
    let unchanged = 0;
    let notComparable = 0;

    const testComparisons = [];


    for (const currentRun of currentRuns) {
      let baselineRun = null;


      if (currentRun.testCaseId) {
        baselineRun =
          baselineByTestCaseId.get(
            currentRun.testCaseId.toString()
          );
      }


      if (!baselineRun) {
        baselineRun =
          baselineByInput.get(
            normalizeInput(
              currentRun.input
            )
          );
      }


      if (!baselineRun) {
        notComparable += 1;

        testComparisons.push({
          input:
            currentRun.input,

          expectedOutput:
            currentRun.expectedOutput,

          change:
            "not_comparable",

          baseline: null,

          current: {
            success:
              currentRun.success,

            score:
              currentRun.evaluation
                ?.score ?? null,

            passed:
              currentRun.evaluation
                ?.passed ?? null,

            method:
              currentRun.evaluation
                ?.method || "none",

            latency:
              currentRun.latency,
          },
        });

        continue;
      }


      const baselinePassed =
        baselineRun.evaluation
          ?.passed ?? null;

      const currentPassed =
        currentRun.evaluation
          ?.passed ?? null;


      let change =
        "not_comparable";


      if (
        baselinePassed === true &&
        currentPassed === false
      ) {
        change = "regression";
        regressions += 1;

      } else if (
        baselinePassed === false &&
        currentPassed === true
      ) {
        change = "improvement";
        improvements += 1;

      } else if (
        baselinePassed !== null &&
        currentPassed !== null &&
        baselinePassed ===
        currentPassed
      ) {
        change = "unchanged";
        unchanged += 1;

      } else {
        notComparable += 1;
      }


      testComparisons.push({
        input:
          currentRun.input,

        expectedOutput:
          currentRun.expectedOutput,

        change,

        baseline: {
          success:
            baselineRun.success,

          score:
            baselineRun.evaluation
              ?.score ?? null,

          passed:
            baselinePassed,

          method:
            baselineRun.evaluation
              ?.method || "none",

          latency:
            baselineRun.latency,
        },

        current: {
          success:
            currentRun.success,

          score:
            currentRun.evaluation
              ?.score ?? null,

          passed:
            currentPassed,

          method:
            currentRun.evaluation
              ?.method || "none",

          latency:
            currentRun.latency,
        },
      });
    }


    const calculateDelta = (
      baselineValue,
      currentValue
    ) => {
      if (
        baselineValue == null ||
        currentValue == null
      ) {
        return null;
      }

      return Number(
        (
          currentValue -
          baselineValue
        ).toFixed(2)
      );
    };


    return res.status(200).json({
      message:
        "Evaluation batches compared successfully",

      comparison: {
        baseline: {
          _id:
            baselineBatch._id,

          agent:
            baselineBatch.agent,

          dataset:
            baselineBatch.dataset,

          correctnessRate:
            baselineBatch.correctnessRate,

          averageScore:
            baselineBatch.averageScore,

          averageLatency:
            baselineBatch.averageLatency,

          successfulRuns:
            baselineBatch.successfulRuns,

          totalTests:
            baselineBatch.totalTests,

          createdAt:
            baselineBatch.createdAt,
        },

        current: {
          _id:
            currentBatch._id,

          agent:
            currentBatch.agent,

          dataset:
            currentBatch.dataset,

          correctnessRate:
            currentBatch.correctnessRate,

          averageScore:
            currentBatch.averageScore,

          averageLatency:
            currentBatch.averageLatency,

          successfulRuns:
            currentBatch.successfulRuns,

          totalTests:
            currentBatch.totalTests,

          createdAt:
            currentBatch.createdAt,
        },

        deltas: {
          correctnessRate:
            calculateDelta(
              baselineBatch.correctnessRate,
              currentBatch.correctnessRate
            ),

          averageScore:
            calculateDelta(
              baselineBatch.averageScore,
              currentBatch.averageScore
            ),

          averageLatency:
            calculateDelta(
              baselineBatch.averageLatency,
              currentBatch.averageLatency
            ),
        },

        regressions,
        improvements,
        unchanged,
        notComparable,
      },

      tests:
        testComparisons,
    });

  } catch (error) {
    console.error(
      "Compare evaluation batches error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to compare evaluation batches",
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
    }).select("+credential");

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }
    let validatedAgentUrl;

    try {
      validatedAgentUrl =
        await validateAgentUrl(
          agent.endpointUrl
        );
    } catch (urlError) {
      return res.status(400).json({
        message: urlError.message,
      });
    }

    const requestHeaders = {
      "Content-Type": "application/json",
    };

    if (agent.authType !== "none") {
      if (
        !agent.credentialConfigured ||
        !agent.credential
      ) {
        return res.status(400).json({
          message:
            "Agent credential is not configured",
        });
      }

      const credential =
        decryptCredential(
          agent.credential
        );

      if (!credential) {
        return res.status(400).json({
          message:
            "Agent credential could not be loaded",
        });
      }

      if (agent.authType === "bearer") {
        requestHeaders.Authorization =
          `Bearer ${credential}`;
      }

      if (agent.authType === "api_key") {
        let safeHeaderName;

        try {
          safeHeaderName =
            validateAuthHeaderName(
              agent.authHeaderName
            );
        } catch (headerError) {
          return res.status(400).json({
            message: headerError.message,
          });
        }

        requestHeaders[
          safeHeaderName
        ] = credential;
      }
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
    let evaluatedTests = 0;
    let passedEvaluations = 0;
    let failedEvaluations = 0;
    let totalScore = 0;

    const results = [];

    for (const testCase of dataset.testCases) {
      const startTime = Date.now();

      let agentResponse;
      let latency;

      try {
        if (agent.method === "POST") {
          const response = await fetch(
            validatedAgentUrl,
            {
              method: "POST",
              redirect: "manual",
              headers: requestHeaders,

              body: JSON.stringify({
                input: testCase.input,
              }),
              signal:
                AbortSignal.timeout(10000),
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
            validatedAgentUrl
          );

          url.searchParams.set(
            "input",
            testCase.input
          );

          const response =
            await fetch(url, {
              headers: requestHeaders,
              redirect: "manual",
              signal:
                AbortSignal.timeout(10000),
            });

          if (!response.ok) {
            throw new Error(
              `Agent returned status ${response.status}`
            );
          }

          agentResponse =
            await response.json();
        }

        latency =
          Date.now() - startTime;

        totalLatency += latency;
        successfulRuns += 1;

      } catch (error) {
        latency =
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

            dataset: dataset._id,

            batch: batch._id,

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

        continue;
      }


      let evaluation;

      try {
        const exactEvaluation =
          evaluateNormalizedExact(
            testCase.expectedOutput || "",
            agentResponse
          );


        if (
          exactEvaluation.passed === true ||
          exactEvaluation.passed === null
        ) {
          evaluation =
            exactEvaluation;

        } else {
          try {
            evaluation =
              await evaluateSemanticMeaning(
                testCase.expectedOutput || "",
                agentResponse
              );

          } catch (semanticError) {
            console.error(
              "Semantic evaluation failed:",
              semanticError.message
            );

            evaluation =
              evaluateTokenSimilarity(
                testCase.expectedOutput || "",
                agentResponse
              );
          }
        }

      } catch (error) {
        console.error(
          "Evaluation engine error:",
          error.message
        );

        evaluation = {
          method: "none",
          score: null,
          passed: null,
          reason:
            "Evaluation engine could not evaluate this response.",
        };
      }


      if (
        evaluation.passed !== null &&
        evaluation.score !== null
      ) {
        evaluatedTests += 1;

        totalScore +=
          evaluation.score;

        if (evaluation.passed) {
          passedEvaluations += 1;
        } else {
          failedEvaluations += 1;
        }
      }


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
    }

    const averageLatency =
      dataset.testCases.length > 0
        ? Math.round(
          totalLatency /
          dataset.testCases.length
        )
        : 0;

    const averageScore =
      evaluatedTests > 0
        ? Number(
          (
            totalScore / evaluatedTests
          ).toFixed(2)
        )
        : null;
    const correctnessRate =
      evaluatedTests > 0
        ? Number(
          (
            (passedEvaluations /
              evaluatedTests) *
            100
          ).toFixed(2)
        )
        : null;

    batch.status = "completed";

    batch.successfulRuns =
      successfulRuns;

    batch.failedRuns =
      failedRuns;

    batch.evaluatedTests =
      evaluatedTests;

    batch.passedEvaluations =
      passedEvaluations;

    batch.failedEvaluations =
      failedEvaluations;

    batch.averageScore =
      averageScore;

    batch.correctnessRate =
      correctnessRate;

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

        evaluatedTests,

        passedEvaluations,

        failedEvaluations,

        averageScore,

        correctnessRate,

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