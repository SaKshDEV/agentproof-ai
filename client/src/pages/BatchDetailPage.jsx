import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Bot,
  Database,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import api from "../services/api";

function BatchDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [batch, setBatch] =
    useState(null);

  const [runs, setRuns] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        `/evaluations/batches/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setBatch(response.data.batch);
      setRuns(response.data.runs || []);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load batch details"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8 text-slate-400">
        Loading batch details...
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
        <div className="mx-auto max-w-6xl">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/evaluations/batches"
              )
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to batch history
          </button>

          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error ||
              "Batch not found"}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-6xl">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/evaluations/batches"
            )
          }
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to batch history
        </button>


        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Bot size={21} />
              </div>

              <div>
                <p className="text-sm font-medium text-violet-400">
                  Batch evaluation
                </p>

                <h1 className="mt-1 text-3xl font-bold">
                  {batch.agent?.name ||
                    "Unknown agent"}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                  <Database size={15} />

                  {batch.dataset?.name ||
                    "Unknown dataset"}
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  {new Date(
                    batch.createdAt
                  ).toLocaleString()}
                </p>
              </div>

            </div>


            <StatusBadge
              status={batch.status}
            />

          </div>


          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <MetricCard
              label="Total tests"
              value={batch.totalTests}
            />

            <MetricCard
              label="Execution success"
              value={`${batch.successfulRuns}/${batch.totalTests}`}
            />

            <MetricCard
              label="Evaluated tests"
              value={batch.evaluatedTests}
            />

            <MetricCard
              label="Correctness rate"
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
              label="Average latency"
              value={`${batch.averageLatency} ms`}
            />

          </div>

        </div>


        <div className="mt-8">

          <h2 className="text-xl font-semibold">
            Test Results
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Individual execution and evaluation
            results from this batch.
          </p>


          <div className="mt-6 space-y-4">

            {runs.map((run, index) => (

              <div
                key={run._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    {run.success ? (
                      <CheckCircle2
                        size={19}
                        className="text-emerald-400"
                      />
                    ) : (
                      <XCircle
                        size={19}
                        className="text-red-400"
                      />
                    )}

                    <div>
                      <p className="font-semibold">
                        Test case {index + 1}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          run.success
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {run.success
                          ? "Execution passed"
                          : "Execution failed"}
                      </p>
                    </div>

                  </div>


                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-400">

                    <Clock3 size={14} />

                    {run.latency} ms

                  </div>

                </div>


                {run.evaluation && (

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">

                    <ResultMetric
                      label="Correctness"
                      value={
                        run.evaluation
                          .passed === true
                          ? "Passed"
                          : run.evaluation
                                .passed ===
                              false
                            ? "Failed"
                            : "Not evaluated"
                      }
                    />

                    <ResultMetric
                      label="Score"
                      value={
                        run.evaluation
                          .score == null
                          ? "N/A"
                          : `${run.evaluation.score}%`
                      }
                    />

                    <ResultMetric
                      label="Method"
                      value={formatMethod(
                        run.evaluation.method
                      )}
                    />

                  </div>
                )}


                <ContentBlock
                  label="Input"
                  value={run.input}
                />

                <ContentBlock
                  label="Expected output"
                  value={
                    run.expectedOutput ||
                    "No expected output provided."
                  }
                />


                {run.success ? (

                  <ContentBlock
                    label="Agent response"
                    value={
                      typeof run.output ===
                      "string"
                        ? run.output
                        : JSON.stringify(
                            run.output,
                            null,
                            2
                          )
                    }
                    pre
                  />

                ) : (

                  <div className="mt-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                      Error
                    </p>

                    <div className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                      {run.error ||
                        "Agent execution failed"}
                    </div>

                  </div>
                )}


                {run.evaluation?.reason && (

                  <div className="mt-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Evaluation reason
                    </p>

                    <div
                      className={`mt-2 rounded-xl border p-4 text-sm leading-6 ${
                        run.evaluation
                          .passed === true
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : run.evaluation
                                .passed ===
                              false
                            ? "border-red-500/20 bg-red-500/10 text-red-300"
                            : "border-white/10 bg-white/[0.03] text-slate-400"
                      }`}
                    >
                      {
                        run.evaluation
                          .reason
                      }
                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}


function formatMethod(method) {
  if (
    method === "normalized_exact"
  ) {
    return "Normalized Exact";
  }

  if (
    method === "token_similarity"
  ) {
    return "Token Similarity";
  }

  if (method === "semantic") {
    return "Semantic";
  }

  return "None";
}


function MetricCard({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-bold">
        {value}
      </p>

    </div>
  );
}


function ResultMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>

    </div>
  );
}


function ContentBlock({
  label,
  value,
  pre = false,
}) {
  return (
    <div className="mt-5">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      {pre ? (
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-violet-500/10 bg-violet-500/[0.04] p-4 text-sm leading-6 text-slate-300">
          {value}
        </pre>
      ) : (
        <div className="mt-2 rounded-xl border border-white/5 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
          {value}
        </div>
      )}

    </div>
  );
}


function StatusBadge({ status }) {
  if (status === "completed") {
    return (
      <span className="flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
        <CheckCircle2 size={13} />
        Completed
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="flex w-fit items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
        <XCircle size={13} />
        Failed
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
      Running
    </span>
  );
}

export default BatchDetailPage;