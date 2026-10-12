import {
  ArrowLeft,
  GitCompareArrows,
  TrendingUp,
  TrendingDown,
  Minus,
  TriangleAlert,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";


function CompareRunsPage() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [baselineId, setBaselineId] =
    useState("");
  const [currentId, setCurrentId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [compareLoading, setCompareLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);


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
        "Failed to load evaluation batches"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBatches();
  }, []);


  const selectedBaseline =
    useMemo(
      () =>
        batches.find(
          (batch) =>
            batch._id === baselineId
        ) || null,
      [batches, baselineId]
    );
  const compatibleCurrentBatches =
    useMemo(() => {
      if (!selectedBaseline) {
        return [];
      }

      const datasetId =
        selectedBaseline.dataset?._id;

      if (!datasetId) {
        return [];
      }

      const baselineTime =
        new Date(
          selectedBaseline.createdAt
        ).getTime();

      return batches
        .filter(
          (batch) =>
            batch._id !== baselineId &&
            batch.dataset?._id === datasetId &&
            new Date(
              batch.createdAt
            ).getTime() > baselineTime
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
    }, [
      batches,
      baselineId,
      selectedBaseline,
    ]);


  const handleBaselineChange = (e) => {
    setBaselineId(e.target.value);
    setCurrentId("");
    setResult(null);
    setError("");
  };


  const compareRuns = async (e) => {
    e.preventDefault();

    if (!baselineId || !currentId) {
      setError(
        "Select both baseline and current batches."
      );
      return;
    }

    try {
      setCompareLoading(true);
      setError("");
      setResult(null);

      const token =
        localStorage.getItem("token");

      const response = await api.post(
        "/evaluations/compare",
        {
          baselineBatchId:
            baselineId,

          currentBatchId:
            currentId,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setResult(response.data);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to compare evaluation batches"
      );

    } finally {
      setCompareLoading(false);
    }
  };


  const comparison =
    result?.comparison;

  const tests =
    result?.tests || [];


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

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


        <div className="mt-8 flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <GitCompareArrows size={23} />
          </div>

          <div>
            <p className="text-sm font-medium text-violet-400">
              Regression testing
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Compare evaluation runs
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Compare two runs from the
              same dataset to detect
              regressions, improvements
              and performance changes.
            </p>
          </div>

        </div>


        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        <form
          onSubmit={compareRuns}
          className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >

          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-end">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Baseline batch
              </label>

              <select
                value={baselineId}
                onChange={
                  handleBaselineChange
                }
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
              >
                <option value="">
                  Select baseline
                </option>

                {batches.map((batch) => (
                  <option
                    key={batch._id}
                    value={batch._id}
                  >
                    {batch.agent?.name || "Unknown agent"}{" "}
                    —{" "}
                    {batch.dataset?.name || "Unknown dataset"}{" "}
                    —{" "}
                    {batch.correctnessRate == null
                      ? "N/A"
                      : `${batch.correctnessRate}%`}{" "}
                    —{" "}
                    {new Date(
                      batch.createdAt
                    ).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>


            <div className="hidden pb-3 text-slate-600 lg:block">
              VS
            </div>


            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Current batch
              </label>

              <select
                value={currentId}
                onChange={(e) => {
                  setCurrentId(
                    e.target.value
                  );
                  setResult(null);
                  setError("");
                }}
                disabled={!baselineId}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  Select current run
                </option>

                {compatibleCurrentBatches.map(
                  (batch) => (
                    <option
                      key={batch._id}
                      value={batch._id}
                    >
                      {batch.agent?.name ||
                        "Unknown agent"}{" "}
                      —{" "}
                      {new Date(
                        batch.createdAt
                      ).toLocaleString()}
                    </option>
                  )
                )}
              </select>
            </div>

          </div>


          <button
            type="submit"
            disabled={
              compareLoading ||
              !baselineId ||
              !currentId
            }
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitCompareArrows
              size={17}
            />

            {compareLoading
              ? "Comparing..."
              : "Compare runs"}
          </button>

        </form>


        {comparison && (
          <>

            {comparison.notComparable >
              0 && (
                <div className="mt-6 flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-4 text-sm text-amber-300">
                  <TriangleAlert
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p>
                    {
                      comparison.notComparable
                    }{" "}
                    test
                    {comparison.notComparable ===
                      1
                      ? ""
                      : "s"}{" "}
                    could not be matched
                    between these runs.
                    Aggregate metrics are
                    still shown, but those
                    tests are excluded from
                    regression classification.
                  </p>
                </div>
              )}


            <div className="mt-8 grid gap-6 lg:grid-cols-2">

              <RunCard
                title="Baseline"
                batch={
                  comparison.baseline
                }
              />

              <RunCard
                title="Current"
                batch={
                  comparison.current
                }
              />

            </div>


            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <DeltaCard
                label="Correctness delta"
                value={
                  comparison.deltas
                    .correctnessRate
                }
                suffix="%"
                positiveIsGood
              />

              <DeltaCard
                label="Average score delta"
                value={
                  comparison.deltas
                    .averageScore
                }
                suffix="%"
                positiveIsGood
              />

              <DeltaCard
                label="Latency delta"
                value={
                  comparison.deltas
                    .averageLatency
                }
                suffix=" ms"
                positiveIsGood={false}
              />

            </div>


            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <SummaryCard
                label="Regressions"
                value={
                  comparison.regressions
                }
              />

              <SummaryCard
                label="Improvements"
                value={
                  comparison.improvements
                }
              />

              <SummaryCard
                label="Unchanged"
                value={
                  comparison.unchanged
                }
              />

              <SummaryCard
                label="Not comparable"
                value={
                  comparison.notComparable
                }
              />

            </div>


            <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">

              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="font-semibold">
                  Test case comparison
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Compare correctness,
                  score and latency for
                  individual test cases.
                </p>
              </div>


              <div>
                {tests.length === 0 ? (
                  <div className="px-6 py-8 text-sm text-slate-500">
                    No test comparisons
                    available.
                  </div>
                ) : (
                  tests.map(
                    (test, index) => (
                      <TestComparison
                        key={`${test.input}-${index}`}
                        test={test}
                        index={index}
                      />
                    )
                  )
                )}
              </div>

            </section>

          </>
        )}

      </div>

    </div>
  );
}


function RunCard({
  title,
  batch,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <p className="text-sm font-medium text-violet-400">
        {title}
      </p>

      <h3 className="mt-2 text-lg font-semibold">
        {batch.agent?.name ||
          "Unknown agent"}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {batch.dataset?.name ||
          "Unknown dataset"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <MiniMetric
          label="Correctness"
          value={
            batch.correctnessRate ==
              null
              ? "N/A"
              : `${batch.correctnessRate}%`
          }
        />

        <MiniMetric
          label="Avg. score"
          value={
            batch.averageScore == null
              ? "N/A"
              : `${batch.averageScore}%`
          }
        />

        <MiniMetric
          label="Avg. latency"
          value={`${batch.averageLatency} ms`}
        />

        <MiniMetric
          label="Execution"
          value={`${batch.successfulRuns}/${batch.totalTests}`}
        />

      </div>

    </div>
  );
}


function MiniMetric({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>

    </div>
  );
}


function DeltaCard({
  label,
  value,
  suffix,
  positiveIsGood,
}) {
  if (value == null) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm text-slate-400">
          {label}
        </p>

        <p className="mt-4 text-xl font-bold">
          N/A
        </p>
      </div>
    );
  }


  const improved =
    value === 0
      ? null
      : positiveIsGood
        ? value > 0
        : value < 0;


  const Icon =
    value === 0
      ? Minus
      : value > 0
        ? TrendingUp
        : TrendingDown;


  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <div className="mt-4 flex items-center gap-2">

        <Icon size={18} />

        <p
          className={`text-xl font-bold ${improved === true
            ? "text-emerald-400"
            : improved === false
              ? "text-red-400"
              : "text-slate-300"
            }`}
        >
          {value > 0 ? "+" : ""}
          {value}
          {suffix}
        </p>

      </div>

    </div>
  );
}


function SummaryCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}


function TestComparison({
  test,
  index,
}) {
  const statusStyles = {
    regression:
      "bg-red-500/10 text-red-400",

    improvement:
      "bg-emerald-500/10 text-emerald-400",

    unchanged:
      "bg-slate-500/10 text-slate-300",

    not_comparable:
      "bg-amber-500/10 text-amber-400",
  };


  return (
    <div className="border-b border-white/5 px-6 py-6 last:border-none">

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <p className="text-xs text-slate-500">
            Test case {index + 1}
          </p>

          <p className="mt-1 text-sm font-medium">
            {test.input}
          </p>
        </div>


        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[test.change]
            }`}
        >
          {test.change
            .replace("_", " ")
            .replace(/\b\w/g, (char) =>
              char.toUpperCase()
            )}
        </span>

      </div>


      <div className="mt-5 grid gap-4 md:grid-cols-2">

        <TestSide
          title="Baseline"
          data={test.baseline}
        />

        <TestSide
          title="Current"
          data={test.current}
        />

      </div>

    </div>
  );
}


function TestSide({
  title,
  data,
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">

      <p className="text-xs font-medium text-slate-500">
        {title}
      </p>

      {!data ? (
        <p className="mt-3 text-sm text-slate-500">
          No matching test found.
        </p>
      ) : (
        <div className="mt-3 space-y-2 text-sm">

          <p>
            <span className="text-slate-500">
              Correctness:{" "}
            </span>

            {data.passed == null
              ? "N/A"
              : data.passed
                ? "Passed"
                : "Failed"}
          </p>

          <p>
            <span className="text-slate-500">
              Score:{" "}
            </span>

            {data.score == null
              ? "N/A"
              : `${data.score}%`}
          </p>

          <p>
            <span className="text-slate-500">
              Latency:{" "}
            </span>

            {data.latency} ms
          </p>

          <p>
            <span className="text-slate-500">
              Method:{" "}
            </span>

            {data.method === "normalized_exact"
              ? "Normalized Exact"
              : data.method === "token_similarity"
                ? "Token Similarity"
                : data.method === "semantic"
                  ? "Semantic"
                  : "None"}
          </p>

        </div>
      )}

    </div>
  );
}


export default CompareRunsPage;