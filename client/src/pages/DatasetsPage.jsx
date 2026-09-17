import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Database,
  Plus,
  FileText,
} from "lucide-react";

import api from "../services/api";

function DatasetsPage() {
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get("/datasets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDatasets(response.data.datasets);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load datasets"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
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


        <div className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-medium text-violet-400">
              Test datasets
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Evaluation datasets
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Build reusable test sets for evaluating your AI agents.
            </p>
          </div>

          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition hover:bg-violet-500"
          >
            <Plus size={17} />
            New dataset
          </button>

        </div>


        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        {loading ? (

          <div className="mt-10 text-sm text-slate-500">
            Loading datasets...
          </div>

        ) : datasets.length === 0 ? (

          <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

            <Database
              size={36}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold">
              No datasets yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create a dataset to start testing agents with multiple test cases.
            </p>

          </div>

        ) : (

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {datasets.map((dataset) => (

              <div
                key={dataset._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/30"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Database size={20} />
                  </div>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                    {dataset.testCases?.length || 0} tests
                  </span>

                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  {dataset.name}
                </h2>

                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
                  {dataset.description ||
                    "No description provided."}
                </p>

                <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4 text-xs text-slate-500">

                  <FileText size={14} />

                  Created{" "}
                  {new Date(
                    dataset.createdAt
                  ).toLocaleDateString()}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default DatasetsPage;