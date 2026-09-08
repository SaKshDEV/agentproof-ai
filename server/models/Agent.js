import mongoose from "mongoose"
const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        default: "",
    },
    endpointUrl: {
        type: String,
        required: true,
        trim: true,

    },
    method: {
        type: "String",
        enum: ["POST", "GET"],
        default: "POST",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
    {
        timestamps: true,
    }
);

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;