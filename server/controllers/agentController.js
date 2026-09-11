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