import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bot,
  Plus,
  Globe2,
} from "lucide-react";

import api from "../services/api";

function AgentsPage() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

          <button className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500">
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

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AgentsPage;