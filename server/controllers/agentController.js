import Agent from "../models/Agent.js";

export const createAgent = async (req, res) => {
  try {
    const {
      name,
      description,
      endpointUrl,
      method,
    } = req.body;

    if (!name || !endpointUrl) {
      return res.status(400).json({
        message: "Agent name and endpoint URL are required",
      });
    }

    const agent = await Agent.create({
      name,
      description,
      endpointUrl,
      method,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Agent created successfully",
      agent,
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

export const deleteAgent = async (req,res) => {
  try{
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
  }catch(error){
    console.error("Delete agent error:", error.message);
    
    return res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateAgent = async (req,res)=>{
  try{
    const {
      name,
      description,
      endpointUrl,
      method
    } = req.body;
    const agent = await Agent.findOne({
    _id: req.params.id,
    user: req.user._id,
    });
    
    if(!agent){
      return res.status(404).json({
        message:"Agent not found"
      });
    }
    if(name !== undefined){
      agent.name = name;
    }
    if(description !== undefined){
      agent.description = description;
    }
    if(endpointUrl !== undefined){
      agent.endpointUrl= endpointUrl;
    }
    if(method !== undefined){
      agent.method = method;
    }
    await agent.save();
    
    return res.status(200).json({
      message:" Agent updated successfully",
      agent,
    });

  }catch(error){
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
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        message: "Test input is required",
      });
    }

    const agent = await Agent.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    const startTime = Date.now();

    let agentResponse;

    if (agent.method === "POST") {
      const response = await fetch(agent.endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Agent returned status ${response.status}`
        );
      }

      agentResponse = await response.json();

    } else {
      const url = new URL(agent.endpointUrl);

      url.searchParams.set("input", input);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Agent returned status ${response.status}`
        );
      }

      agentResponse = await response.json();
    }

    const endTime = Date.now();

    const latency = endTime - startTime;

    return res.status(200).json({
      success: true,
      input,
      response: agentResponse,
      latency,
    });

  } catch (error) {
    console.error(
      "Test agent error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Agent test failed",
      error: error.message,
    });
  }
};