import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Bot,
  FlaskConical,
  Database,
  Settings,
  LogOut,
  Plus,
  Activity,
  ShieldCheck,
  Clock3,
  TriangleAlert,
  X,
} from "lucide-react";

import api from "../services/api"


function DashboardPage() {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([])
  const [agentsLoading, setAgentsLoading] = useState(true)
  const [agentsError, setAgentsError] = useState("");

  const [evaluations, setEvaluations] = useState([])
  const [evaluationsLoading, setEvaluationsLoading] = useState(true)
  const [evaluationsError, setEvaluationsError] = useState("")

  const [showAddAgent, setShowAddAgent] = useState(false);

  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [method, setMethod] = useState("POST");

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("")
  const [showNewEvaluation, setShowNewEvaluation] = useState(false);

  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [evaluationInput, setEvaluationInput] = useState("");

  const [evaluationRunLoading, setEvaluationRunLoading] = useState(false);
  const [evaluationRunError, setEvaluationRunError] = useState("");
  const [evaluationResult, setEvaluationResult] = useState(null);

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const fetchAgents = async () => {
    try {
      setAgentsLoading(true);
      setAgentsError("");

      const token = localStorage.getItem("token")

      const response = await api.get("/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgents(response.data.agents);
    } catch (error) {

      setAgentsError(
        error.response?.data?.message ||
        "Failed to load agents"
      );
    } finally {
      setAgentsLoading(false)
    }
  }

  const fetchEvaluations = async () => {
    try {
      setEvaluationsLoading(true)
      setEvaluationsError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/evaluations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvaluations(response.data.evaluations);
    } catch (error) {
      setEvaluationsError(
        error.response?.data?.message ||
        "Failed to load evaluations"
      );

    } finally {
      setEvaluationsLoading(false);
    }

  }

  useEffect(() => {
    fetchAgents();
    fetchEvaluations();
  }, []);

  const successfulRuns = evaluations.filter(
    (evaluation) => evaluation.success
  ).length

  const failedRuns = evaluations.filter(
    (evaluation) => !evaluation.success
  ).length

  const successRate =
    evaluations.length > 0
      ? Math.round(
        (successfulRuns / evaluations.length) * 100
      )
      : 0;
  const averageLatency =
    evaluations.length > 0
      ? Math.round(
        evaluations.reduce(
          (total, evaluation) =>
            total + evaluation.latency,
          0
        ) / evaluations.length
      )
      : 0;

  const recentEvaluations = [...evaluations]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 3)

  const createAgent = async (e) => {
    e.preventDefault();

    if (!agentName || !endpointUrl) {
      setCreateError(
        "Agent name and endpoint URL are required."
      );
      return;

    }
    try {
      setCreateLoading(true)
      setCreateError("")
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
        ...currentAgents
      ]);
      setAgentName("")
      setAgentDescription("")
      setEndpointUrl("")
      setMethod("POST");

      setShowAddAgent(false);

    } catch (error) {
      setCreateError(
        error.response?.data?.message ||
        "Failed to create agent"
      );
    } finally {
      setCreateLoading(false)
    }
  };



  const openNewEvaluation = () => {
    setSelectedAgentId(
      agents.length > 0 ? agents[0]._id : ""
    );

    setEvaluationInput("");
    setEvaluationRunError("");
    setEvaluationResult(null);

    setShowNewEvaluation(true);
  };

  const runNewEvaluation = async (e) => {
    e.preventDefault();

    if (!selectedAgentId) {
      setEvaluationRunError(
        "Please select an agent."
      );
      return;
    }

    if (!evaluationInput.trim()) {
      setEvaluationRunError(
        "Test input is required."
      );
      return;
    }

    try {
      setEvaluationRunLoading(true);
      setEvaluationRunError("");
      setEvaluationResult(null);

      const token = localStorage.getItem("token");

      const response = await api.post(
        `/agents/${selectedAgentId}/test`,
        {
          input: evaluationInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvaluationResult(response.data);

      await fetchEvaluations();

    } catch (error) {
      setEvaluationRunError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Evaluation failed"
      );

      await fetchEvaluations();

    } finally {
      setEvaluationRunLoading(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex min-h-screen">


        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950 lg:flex lg:flex-col">


          <div className="flex h-20 items-center border-b border-white/10 px-6">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
              <ShieldCheck size={19} />
            </div>

            <span className="ml-3 text-lg font-bold">
              AgentProof
              <span className="text-violet-400"> AI</span>
            </span>

          </div>



          <nav className="flex-1 space-y-2 px-4 py-6">

            <SidebarItem
              icon={LayoutDashboard}
              label="Overview"
              active
            />

            <SidebarItem
              icon={Bot}
              label="Agents"
              onClick={() => navigate("/agents")}
            />

            <SidebarItem
              icon={FlaskConical}
              label="Evaluations"
              onClick={() => navigate("/evaluations")}
            />

            <SidebarItem
              icon={Database}
              label="Datasets"
            />

            <SidebarItem
              icon={Settings}
              label="Settings"
            />

          </nav>


          <div className="border-t border-white/10 p-4">

            <div className="mb-3 rounded-xl bg-white/[0.03] p-3">

              <p className="truncate text-sm font-medium text-white">
                {user?.name || "AgentProof User"}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {user?.email || "user@example.com"}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={17} />

              Logout
            </button>

          </div>

        </aside>



        <main className="min-w-0 flex-1">


          <header className="flex h-20 items-center justify-between border-b border-white/10 px-6 lg:px-8">

            <div>
              <p className="text-sm text-slate-500">
                Workspace
              </p>

              <h1 className="mt-1 text-lg font-semibold">
                Production AI
              </h1>
            </div>

            <button
            onClick={openNewEvaluation}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500">
              <Plus size={17} />

              New evaluation
            </button>

          </header>



          <div className="p-6 lg:p-8">


            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>
                <p className="text-sm font-medium text-violet-400">
                  Overview
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Welcome back, {user?.name || "there"}.
                </h2>

                <p className="mt-3 text-sm text-slate-400">
                  Monitor your AI agents and catch reliability issues before production.
                </p>
              </div>

            </div>
            {agentsError && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {agentsError}
              </div>
            )}
            {evaluationsError && (
              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {evaluationsError}
              </div>
            )}



            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                icon={Bot}
                label="Active Agents"
                value={agentsLoading ? "..." : agents.length}
                detail={
                  agents.length === 1
                    ? "1 connected agent"
                    : `${agents.length} connected agents`
                }
              />

              <StatCard
                icon={Activity}
                label="Run Success Rate"
                value={
                  evaluationsLoading
                    ? "..."
                    : `${successRate}%`
                }
                detail={
                  evaluationsLoading
                    ? "Loading evaluation data"
                    : evaluations.length === 0
                      ? "No evaluations yet"
                      : `${successfulRuns} of ${evaluations.length} runs succeeded`
                }
              />

              <StatCard
                icon={Clock3}
                label="Avg. Latency"
                value={
                  evaluationsLoading
                    ? "..."
                    : `${averageLatency} ms`
                }
                detail={
                  evaluations.length === 0
                    ? "No evaluation data"
                    : `Across ${evaluations.length} runs`
                }
              />

              <StatCard
                icon={TriangleAlert}
                label="Failed Tests"
                value={
                  evaluationsLoading
                    ? "..."
                    : failedRuns
                }
                detail={
                  evaluations.length === 0
                    ? "No evaluations yet"
                    : failedRuns === 1
                      ? "1 failed run"
                      : `${failedRuns} failed runs`
                }
              />

            </div>


            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">


              <section className="rounded-2xl border border-white/10 bg-white/[0.03]">

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                  <div>
                    <h3 className="font-semibold">
                      Recent evaluations
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Latest runs across your agents
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/evaluations")}
                    className="text-sm font-medium text-violet-400 hover:text-violet-300">
                    View all
                  </button>

                </div>

                <div>
                  {evaluationsLoading ? (
                    <div className="px-6 py-8 text-sm text-slate-500">
                      Loading evaluation...
                    </div>
                  ) : recentEvaluations.length === 0 ? (
                    <div className="px-6 py-8 text-sm text-slate-500">
                      No evaluations yet.
                    </div>
                  ) : (
                    recentEvaluations.map((evaluation) => (
                      <EvaluationRow
                        key={evaluation._id}
                        name={
                          evaluation.agent?.name ||
                          "Deleted agent"
                        }
                        latency={evaluation.latency}
                        success={evaluation.success}
                        time={new Date(
                          evaluation.createdAt
                        ).toLocaleString()}
                      />
                    ))
                  )
                  }

                </div>

              </section>



              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <p className="text-sm font-medium text-violet-400">
                  Quick start
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Run your first real evaluation.
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Connect an AI agent, create a test dataset and measure its reliability.
                </p>

                <button
                  onClick={() => setShowAddAgent(true)}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/15">
                  <Plus size={17} />

                  Add your first agent
                </button>

              </section>

            </div>

          </div>

        </main>

      </div>

      {showAddAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add AI agent
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Connect an AI endpoint to AgentProof.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddAgent(false)}
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
                    setAgentDescription(e.target.value)
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
                  onChange={(e) => setEndpointUrl(e.target.value)}
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
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>
              </div>


              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowAddAgent(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
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
       {showNewEvaluation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

    <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

        <div>
          <p className="text-sm font-medium text-violet-400">
            Agent evaluation
          </p>

          <h2 className="mt-1 text-lg font-semibold text-white">
            Run a new evaluation
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowNewEvaluation(false)}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
        >
          <X size={19} />
        </button>

      </div>


      <form
        onSubmit={runNewEvaluation}
        className="space-y-5 p-6"
      >

        {evaluationRunError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {evaluationRunError}
          </div>
        )}


        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            AI agent
          </label>

          <select
            value={selectedAgentId}
            onChange={(e) =>
              setSelectedAgentId(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
          >
            <option value="">
              Select an agent
            </option>

            {agents.map((agent) => (
              <option
                key={agent._id}
                value={agent._id}
              >
                {agent.name}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Test input
          </label>

          <textarea
            value={evaluationInput}
            onChange={(e) =>
              setEvaluationInput(e.target.value)
            }
            placeholder="Ask your AI agent something..."
            rows="4"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
          />
        </div>


        {evaluationResult && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

            <p className="text-sm font-semibold text-emerald-400">
              Evaluation completed
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Latency: {evaluationResult.latency} ms
            </p>

            <pre className="mt-4 max-h-52 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950/70 p-4 text-xs leading-6 text-slate-300">
              {JSON.stringify(
                evaluationResult.response,
                null,
                2
              )}
            </pre>

          </div>
        )}


        <div className="flex gap-3 pt-2">

          <button
            type="button"
            onClick={() =>
              setShowNewEvaluation(false)
            }
            className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Close
          </button>

          <button
            type="submit"
            disabled={
              evaluationRunLoading ||
              agents.length === 0
            }
            className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {evaluationRunLoading
              ? "Running..."
              : "Run evaluation"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}


    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
        ? "bg-violet-500/10 text-violet-300"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      <Icon size={18} />

      {label}
    </button>
  );
}


function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-400">
          {label}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
          <Icon size={18} />
        </div>

      </div>

      <p className="mt-5 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {detail}
      </p>

    </div>
  );
}


function EvaluationRow({
  name,
  latency,
  success,
  time,
}) {
  return (
    <div className="grid grid-cols-[1.5fr_0.6fr_0.7fr] items-center gap-4 border-b border-white/5 px-6 py-5 last:border-none">

      <div>
        <p className="text-sm font-medium text-white">
          {name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {time}
        </p>
      </div>

      <p className="text-sm font-semibold text-slate-300">
        {latency} ms
      </p>

      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${success
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-amber-500/10 text-amber-400"
          }`}
      >
        {success ? "Passed" : "Failed"}
      </span>

     

    </div>

  );
}

export default DashboardPage;