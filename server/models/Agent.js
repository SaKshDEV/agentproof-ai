import mongoose from "mongoose"

const encryptedCredentialSchema =
  new mongoose.Schema(
    {
      encryptedValue: {
        type: String,
        required: true,
      },

      iv: {
        type: String,
        required: true,
      },

      authTag: {
        type: String,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

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
    authType: {
  type: String,
  enum: [
    "none",
    "bearer",
    "api_key",
  ],
  default: "none",
},

authHeaderName: {
  type: String,
  trim: true,
  default: "Authorization",
},

credential: {
  type: encryptedCredentialSchema,
  default: null,
  select: false,
},

credentialConfigured: {
  type: Boolean,
  default: false,
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