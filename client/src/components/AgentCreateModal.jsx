import { useState } from "react";

import { X } from "lucide-react";

import api from "../services/api";

function AgentCreateModal({
    isOpen,
    onClose,
    onCreated,
}) {
    const [agentName, setAgentName] = useState("")
    const [agentDescription, setAgentDescription] = useState("");
    const [endpointUrl, setEndpointUrl] = useState("");
    const [method, setMethod] = useState("POST");
    const [authType, setAuthType] = useState("none");
    const [authHeaderName, setAuthHeaderName] = useState("x-api-key");
    const [credentialValue, setCredentialValue,] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetForm = () => {
        setAgentName("");
        setAgentDescription("");
        setEndpointUrl("");
        setMethod("POST");

        setAuthType("none");
        setAuthHeaderName("x-api-key");
        setCredentialValue("");

        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const createAgent = async (e) => {
        e.preventDefault();
        if (
            !agentName.trim() ||
            !agentDescription.trim() ||
            !endpointUrl.trim()
        ) {
            setError(
                "Agent name, description and endpoint URL are required."
            );
            return;
        } if (
            authType !== "none" &&
            !credentialValue.trim()
        ) {
            setError(
                "Credential is required for authenticated agents."
            );
            return;
        }

        if (
            authType === "api_key" &&
            !authHeaderName.trim()
        ) {
            setError(
                "API key header name is required."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await api.post(
                "/agents",
                {
                    name: agentName.trim(),
                    description:
                        agentDescription.trim(),
                    endpointUrl:
                        endpointUrl.trim(),
                    method,
                    authType,

                    authHeaderName:
                        authType === "api_key"
                            ? authHeaderName.trim()
                            : undefined,

                    credentialValue:
                        authType !== "none"
                            ? credentialValue
                            : undefined,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            onCreated?.(
                response.data.agent
            );

            resetForm();
            onClose();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create agent"
            );

        } finally {
            setLoading(false);
        }
    };


if (!isOpen) {
    return null;
}

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                    <p className="text-sm font-medium text-violet-400">
                        Agent configuration
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-white">
                        Add AI agent
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Connect an AI endpoint securely to AgentProof.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
                >
                    <X size={19} />
                </button>
            </div>

            <form
                onSubmit={createAgent}
                className="space-y-5 p-6"
            >
                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Agent name
                    </label>

                    <input
                        type="text"
                        value={agentName}
                        onChange={(e) =>
                            setAgentName(e.target.value)
                        }
                        placeholder="Customer Support Agent"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Description
                    </label>

                    <textarea
                        value={agentDescription}
                        onChange={(e) =>
                            setAgentDescription(
                                e.target.value
                            )
                        }
                        placeholder="Handles customer support questions..."
                        rows="3"
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Endpoint URL
                    </label>

                    <input
                        type="url"
                        value={endpointUrl}
                        onChange={(e) =>
                            setEndpointUrl(e.target.value)
                        }
                        placeholder="https://api.example.com/chat"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        HTTP method
                    </label>

                    <select
                        value={method}
                        onChange={(e) =>
                            setMethod(e.target.value)
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
                    >
                        <option value="POST">
                            POST
                        </option>

                        <option value="GET">
                            GET
                        </option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                        Authentication
                    </label>

                    <select
                        value={authType}
                        onChange={(e) => {
                            const nextAuthType =
                                e.target.value;

                            setAuthType(
                                nextAuthType
                            );

                            setCredentialValue("");
                            setError("");

                            if (
                                nextAuthType ===
                                "api_key"
                            ) {
                                setAuthHeaderName(
                                    "x-api-key"
                                );
                            }
                        }}
                        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
                    >
                        <option value="none">
                            No authentication
                        </option>

                        <option value="bearer">
                            Bearer token
                        </option>

                        <option value="api_key">
                            API key
                        </option>
                    </select>

                    <p className="mt-2 text-xs text-slate-500">
                        Credentials are encrypted before being stored.
                    </p>
                </div>

                {authType === "api_key" && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            API key header
                        </label>

                        <input
                            type="text"
                            value={authHeaderName}
                            onChange={(e) =>
                                setAuthHeaderName(
                                    e.target.value
                                )
                            }
                            placeholder="x-api-key"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Example: x-api-key or X-API-Key
                        </p>
                    </div>
                )}

                {authType !== "none" && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            {authType === "bearer"
                                ? "Bearer token"
                                : "API key"}
                        </label>

                        <input
                            type="password"
                            value={credentialValue}
                            onChange={(e) =>
                                setCredentialValue(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
                            placeholder={
                                authType === "bearer"
                                    ? "Enter bearer token"
                                    : "Enter API key"
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            The credential will not be returned by the API after configuration.
                        </p>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Adding agent..."
                            : "Add agent"}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
}

export default AgentCreateModal;