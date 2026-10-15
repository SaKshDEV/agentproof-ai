import Agent from "../models/Agent.js";
import EvaluationRun from "../models/EvaluationRun.js";
import {
  encryptCredential,
  decryptCredential
} from "../services/credentialEncryptionService.js";
import {
  validateAgentUrl,
} from "../services/agentUrlSecurityService.js";
import {
  validateAuthHeaderName,
} from "../services/agentAuthSecurityService.js";

const getSafeAgent = (agent) => {
  const safeAgent = agent.toObject();

  delete safeAgent.credential;

  return safeAgent;
}

export const createAgent = async (req, res) => {
  try {
    const {
      name,
      description,
      endpointUrl,
      method,
      authType = "none",
      authHeaderName,
      credentialValue,
    } = req.body;

    if (!name || !endpointUrl) {
      return res.status(400).json({
        message: "Agent name and endpoint URL are required",
      });
    }
    const allowedAuthTypes = [
      "none",
      "bearer",
      "api_key"
    ];
    if (!allowedAuthTypes.includes(authType)) {
      return res.status(400).json({
        message: "Invalid authentication type",
      });
    }

    if (
      authType !== "none" &&
      (
        typeof credentialValue !== "string" ||
        !credentialValue.trim()
      )
    ) {
      return res.status(400).json({
        message:
          "Credential is required for authenticated agents",
      });
    }

    let validatedAuthHeaderName =
      "Authorization";

    if (authType === "api_key") {
      try {
        validatedAuthHeaderName =
          validateAuthHeaderName(
            authHeaderName
          );
      } catch (headerError) {
        return res.status(400).json({
          message: headerError.message,
        });
      }
    }
    const encryptedCredential =
      authType === "none"
        ? null
        : encryptCredential(
          credentialValue
        );

    const agent = await Agent.create({
      name,
      description,
      endpointUrl,
      method,

      authType,

      authHeaderName:
        validatedAuthHeaderName,

      credential:
        encryptedCredential,

      credentialConfigured:
        authType !== "none",
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Agent created successfully",
      agent: getSafeAgent(agent),
    });

  } catch (error) {
    console.error("Create agent error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      agents,
    });

  } catch (error) {
    console.error("Get agents error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found "
      })
    }

    await agent.deleteOne();

    return res.status(200).json({
      message: "Agent deleted successfully"
    })
  } catch (error) {
    console.error("Delete agent error:", error.message);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const {
      name,
      description,
      endpointUrl,
      method,
      authType,
      authHeaderName,
      credentialValue,
    } = req.body;

    const agent = await Agent.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found"
      });
    }
    if (name !== undefined) {
      agent.name = name;
    }
    if (description !== undefined) {
      agent.description = description;
    }
    if (endpointUrl !== undefined) {
      agent.endpointUrl = endpointUrl;
    }
    if (method !== undefined) {
      agent.method = method;
    }
    if (
      authType !== undefined &&
      ![
        "none",
        "bearer",
        "api_key",
      ].includes(authType)
    ) {
      return res.status(400).json({
        message:
          "Invalid authentication type"
      })
    }
    const currentAuthType =
      agent.authType || "none";

    const nextAuthType =
      authType ?? currentAuthType;

    if (
      nextAuthType !== "none" &&
      nextAuthType !== currentAuthType &&
      (
        typeof credentialValue !== "string" ||
        !credentialValue.trim()
      )
    ) {
      return res.status(400).json({
        message:
          "A new credential is required when changing authentication type",
      });
    }

    if (nextAuthType === "none") {
      agent.authType = "none";

      agent.authHeaderName = "Authorization";

      agent.credential = null;

      agent.credentialConfigured = false;
    } else {
      agent.authType = nextAuthType;

      if (nextAuthType === "bearer") {
        agent.authHeaderName = "Authorization";
      }
      if (nextAuthType === "api_key") {
        const nextHeaderName =
          authHeaderName ??
          agent.authHeaderName;

        try {
          agent.authHeaderName =
            validateAuthHeaderName(
              nextHeaderName
            );
        } catch (headerError) {
          return res.status(400).json({
            message: headerError.message,
          });
        }
      }

      if (
        typeof credentialValue === "string" &&
        credentialValue.trim()
      ) {
        agent.credential =
          encryptCredential(credentialValue);

        agent.credentialConfigured = true;
      }

      if (!agent.credentialConfigured) {
        return res.status(400).json({
          message:
            "Credential is required for authenticated agents",
        });
      }
    }

    await agent.save();

    return res.status(200).json({
      message: "Agent updated successfully",
      agent: getSafeAgent(agent),
    });

  } catch (error) {
    console.error(
      "Update agent error:",
      error.message
    )
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export const testAgent = async (req, res) => {
  const { input } = req.body;

  let agent = null;
  let startTime = null;

  try {
    if (!input) {
      return res.status(400).json({
        message: "Test input is required",
      });
    }

    agent = await Agent.findOne({
      _id: req.params.id,
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
        validateAgentUrl(agent.endpointUrl);
    } catch (urlError) {
      return res.status(400).json({
        message: urlError.message,
      });
    }

    const requestHeaders = {
      "Content-Type": "application/json"
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
            validateAuthHeaderName(agent.authHeaderName);
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


    startTime = Date.now();

    let agentResponse;

    if (agent.method === "POST") {
      const response = await fetch(validatedAgentUrl,
        {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({
            input,
          }),
          signal:
            AbortSignal.timeout(10000),
        });

      if (!response.ok) {
        throw new Error(
          `Agent returned status ${response.status}`
        );
      }

      agentResponse = await response.json();

    } else {
      const url = new URL(validatedAgentUrl);

      url.searchParams.set("input", input);

      const response = await fetch(
        url,
        {
          headers: requestHeaders,

          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error(
          `Agent returned status ${response.status}`
        );
      }

      agentResponse = await response.json();
    }

    const endTime = Date.now();

    const latency = endTime - startTime;

    const evaluationRun = await EvaluationRun.create({
      user: req.user._id,
      agent: agent._id,
      input,
      output: agentResponse,
      latency,
      success: true,
    });

    return res.status(200).json({
      success: true,
      input,
      response: agentResponse,
      latency,
      evaluationId: evaluationRun._id,
    });

  } catch (error) {
    console.error(
      "Test agent error:",
      error.message
    );

    const failureLatency = startTime
      ? Date.now() - startTime
      : 0;

    if (agent) {
      try {
        await EvaluationRun.create({
          user: req.user._id,
          agent: agent._id,
          input,
          output: null,
          latency: failureLatency,
          success: false,
          error: error.message,
        });
      } catch (saveError) {
        console.error(
          "Failed to save failed evaluation:",
          saveError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Agent test failed",
      error: error.message,
    });
  }
};