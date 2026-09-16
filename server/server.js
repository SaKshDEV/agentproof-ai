import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import mockAgentRoutes from "./routes/mockAgentRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import datasetRoutes from "./routes/datasetRoutes.js";

dotenv.config();
ConnectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.get("/", (req,res)=>{
    res.send("Agentproof api is running");

});
app.use("/api/mock-agent", mockAgentRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/datasets", datasetRoutes);

 const PORT= process.env.PORT || 5000;
 
 app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
 });

