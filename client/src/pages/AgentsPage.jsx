import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bot,
  Plus,
  Globe2,
  X,
  Trash2,
  Pencil,
} from "lucide-react";

import api from "../services/api";

function AgentsPage() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddAgent, setShowAddAgent] = useState(false);

  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [method, setMethod] = useState("POST");

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [editingAgent, setEditingAgent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("")
  const [editEndpointUrl, setEditEndpointUrl] = useState("");
  const [editMethod, setEditMethod] = useState("POST");

  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")




  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAgents(response.data.agents);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load agents"
      );

    } finally {
      setLoading(false);
    }
  };
  const createAgent = async (e) => {
    e.preventDefault();

    if (!agentName || !endpointUrl) {
      setCreateError(
        "Agent name and endpoint URL are required."
      );
      return;
    }

    try {
      setCreateLoading(true);
      setCreateError("");

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/agents",
        {
          name: agentName,
          description: agentDescription,
          endpointUrl,
          method,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgents((currentAgents) => [
        response.data.agent,
        ...currentAgents,
      ]);

      setAgentName("");
      setAgentDescription("");
      setEndpointUrl("");
      setMethod("POST");

      setShowAddAgent(false);

    } catch (error) {
      setCreateError(
        error.response?.data?.message ||
        "Failed to create agent"
      );

    } finally {
      setCreateLoading(false);
    }
  };

  const deleteAgent = async (agentId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this agent?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(agentId);
      setError("");

      const token = localStorage.getItem("token");

      await api.delete(`/agents/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAgents((currentAgents) =>
        currentAgents.filter(
          (agent) => agent._id !== agentId
        )
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete agent"
      );

    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (agent) => {
    setEditingAgent(agent);

    setEditName(agent.name);
    setEditDescription(agent.description || "");
    setEditEndpointUrl(agent.endpointUrl);
    setEditMethod(agent.method);

    setEditError("");
  };

  const updateAgent = async (e) => {
    e.preventDefault();

    if (!editName || !editEndpointUrl) {
      setEditError(
        "Agent name and endpoint URL are required."
      );
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/agents/${editingAgent._id}`,
        {
          name: editName,
          description: editDescription,
          endpointUrl: editEndpointUrl,
          method: editMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgents((currentAgents) =>
        currentAgents.map((agent) =>
          agent._id === editingAgent._id
            ? response.data.agent
            : agent
        )
      );

      setEditingAgent(null);

    } catch (error) {
      setEditError(
        error.response?.data?.message ||
        "Failed to update agent"
      );

    } finally {
      setEditLoading(false);
    }
  };





  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-7xl">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>


        <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-medium text-violet-400">
              Agent management
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Your AI agents
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Manage the AI endpoints connected to AgentProof.
            </p>
          </div>

          <button
            onClick={() => setShowAddAgent(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500"
          >
            <Plus size={17} />
            Add agent
          </button>

        </div>


        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {loading ? (
          <div className="mt-10 text-sm text-slate-500">
            Loading agents...
          </div>
        ) : agents.length === 0 ? (

          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">

            <Bot
              size={32}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold">
              No agents connected
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add your first AI agent to start running evaluations.
            </p>

          </div>

        ) : (

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {agents.map((agent) => (

              <div
                key={agent._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/30"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Bot size={20} />
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    Connected
                  </span>

                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  {agent.name}
                </h2>

                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
                  {agent.description || "No description provided."}
                </p>


                <div className="mt-5 border-t border-white/10 pt-5">

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Globe2 size={15} />

                    <span className="truncate">
                      {agent.endpointUrl}
                    </span>
                  </div>

                  <span className="mt-4 inline-block rounded-md bg-white/5 px-2 py-1 text-xs font-semibold text-slate-300">
                    {agent.method}
                  </span>

                  <div className="mt-5 flex gap-3">

                    <button
                      onClick={() => openEditModal(agent)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteAgent(agent._id)}
                      disabled={deletingId === agent._id}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={15} />

                      {deletingId === agent._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {showAddAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold">
                  Add AI agent
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Connect an AI endpoint to AgentProof.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddAgent(false);
                  setCreateError("");
                }}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>


            <form
              onSubmit={createAgent}
              className="space-y-5 p-6"
            >

              {createError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {createError}
                </div>
              )}


              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Agent name
                </label>

                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Customer Support Agent"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={agentDescription}
                  onChange={(e) =>
                    setAgentDescription(e.target.value)
                  }
                  placeholder="Handles customer support questions..."
                  rows="3"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500/60"
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
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  HTTP method
                </label>

                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>
              </div>


              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    setShowAddAgent(false);
                    setCreateError("");
                  }}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createLoading
                    ? "Adding agent..."
                    : "Add agent"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
      {editingAgent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

    <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

        <div>
          <h2 className="text-lg font-semibold">
            Edit agent
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update your AI agent configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingAgent(null)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
        >
          <X size={19} />
        </button>

      </div>

      <form
        onSubmit={updateAgent}
        className="space-y-5 p-6"
      >

        {editError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {editError}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Agent name
          </label>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-violet-500/60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Description
          </label>

          <textarea
            value={editDescription}
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
            rows="3"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-violet-500/60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Endpoint URL
          </label>

          <input
            type="url"
            value={editEndpointUrl}
            onChange={(e) =>
              setEditEndpointUrl(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-violet-500/60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            HTTP method
          </label>

          <select
            value={editMethod}
            onChange={(e) =>
              setEditMethod(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">

          <button
            type="button"
            onClick={() => setEditingAgent(null)}
            className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={editLoading}
            className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editLoading
              ? "Saving..."
              : "Save changes"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}


    </div>
  );
}

export default AgentsPage;