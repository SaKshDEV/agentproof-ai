import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import mockAgentRoutes from "./routes/mockAgentRoutes.js";
import evaluationRoutes from "./routes/evaluationRoutes.js";
import datasetRoutes from "./routes/datasetRoutes.js";

dotenv.config();
ConnectDB();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (
                !origin ||
                allowedOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },
    })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.get("/", (req, res) => {
    res.send("Agentproof api is running");
});
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AgentProof API is healthy",
    });
});


app.use("/api/mock-agent", mockAgentRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/datasets", datasetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

