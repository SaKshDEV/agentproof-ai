import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import ConnectDB from "./config/db.js";

dotenv.config();
ConnectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Agentproof api is running");

});
 const PORT= process.env.PORT || 5000;
 
 app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
 });

