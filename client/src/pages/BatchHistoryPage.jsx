import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bot,
  Database,
  Clock3,
  CheckCircle2,
  XCircle,
  History,
  ChevronRight,
} from "lucide-react";

import api from "../services/api";

function BatchHistoryPage() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/evaluations/batches",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBatches(
        response.data.batches || []
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load batch history"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(
      date
    ).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8 text-slate-400">
        Loading batch history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-6xl">

        <button
          type="button"
          onClick={() =>
            navigate("/evaluations")
          }
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to evaluations
        </button>


        <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-medium text-violet-400">
              Evaluation history
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Batch History
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review previous dataset evaluation
              runs, execution performance,
              correctness scores and latency.
            </p>
          </div>


          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">

            <History size={17} />

            <span>
              {batches.length}{" "}
              {batches.length === 1
                ? "batch"
                : "batches"}
            </span>

          </div>

        </div>


        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {!error &&
          batches.length === 0 && (

            <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <History size={22} />
              </div>

              <h2 className="mt-4 font-semibold">
                No batch evaluations yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Run a dataset against an agent
                and the result will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/datasets")
                }
                className="mt-6 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
              >
                Go to datasets
              </button>

            </div>
          )}


        {batches.length > 0 && (

          <div className="mt-8 space-y-4">

            {batches.map((batch) => (

              <div
                key={batch._id}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-violet-500/30 hover:bg-white/[0.05]"
              >

                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <Bot size={20} />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-lg font-semibold">
                          {batch.agent?.name ||
                            "Unknown agent"}
                        </h2>

                        <StatusBadge
                          status={batch.status}
                        />

                      </div>


                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">

                        <Database size={15} />

                        <span>
                          {batch.dataset?.name ||
                            "Unknown dataset"}
                        </span>

                      </div>


                      <p className="mt-2 text-xs text-slate-600">
                        {formatDate(
                          batch.createdAt
                        )}
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/evaluations/batches/${batch._id}`
                      )
                    }
                    className="flex items-center gap-2 self-start rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
                  >
                    View details
                    <ChevronRight size={16} />
                  </button>

                </div>


                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <MetricCard
                    label="Execution"
                    value={`${batch.successfulRuns}/${batch.totalTests}`}
                  />

                  <MetricCard
                    label="Correctness"
                    value={
                      batch.correctnessRate == null
                        ? "N/A"
                        : `${batch.correctnessRate}%`
                    }
                  />

                  <MetricCard
                    label="Average score"
                    value={
                      batch.averageScore == null
                        ? "N/A"
                        : `${batch.averageScore}%`
                    }
                  />

                  <MetricCard
                    label="Avg latency"
                    value={`${batch.averageLatency} ms`}
                    icon={
                      <Clock3 size={14} />
                    }
                  />

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}


function MetricCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">

        {icon && (
          <span className="text-slate-500">
            {icon}
          </span>
        )}

        <p className="text-lg font-bold text-white">
          {value}
        </p>

      </div>

    </div>
  );
}


function StatusBadge({ status }) {
  if (status === "completed") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">

        <CheckCircle2 size={13} />

        Completed

      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">

        <XCircle size={13} />

        Failed

      </span>
    );
  }

  return (
    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
      Running
    </span>
  );
}

export default BatchHistoryPage;