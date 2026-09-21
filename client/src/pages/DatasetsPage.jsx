import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Database,
  Plus,
  FileText,
  X,
  Trash2,
} from "lucide-react";

import api from "../services/api";

function DatasetsPage() {
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateDataset, setShowCreateDataset] =
    useState(false);

  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] =
    useState("");

  const [testCases, setTestCases] = useState([
    {
      input: "",
      expectedOutput: "",
    },
  ]);

  const [createLoading, setCreateLoading] =
    useState(false);

  const [createError, setCreateError] =
    useState("");


  const fetchDatasets = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/datasets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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


  const openCreateDataset = () => {
    setDatasetName("");
    setDatasetDescription("");

    setTestCases([
      {
        input: "",
        expectedOutput: "",
      },
    ]);

    setCreateError("");

    setShowCreateDataset(true);
  };


  const addTestCase = () => {
    setTestCases((currentTestCases) => [
      ...currentTestCases,
      {
        input: "",
        expectedOutput: "",
      },
    ]);
  };


  const removeTestCase = (
    indexToRemove
  ) => {
    if (testCases.length === 1) {
      return;
    }

    setTestCases((currentTestCases) =>
      currentTestCases.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  };


  const updateTestCase = (
    indexToUpdate,
    field,
    value
  ) => {
    setTestCases((currentTestCases) =>
      currentTestCases.map(
        (testCase, index) =>
          index === indexToUpdate
            ? {
                ...testCase,
                [field]: value,
              }
            : testCase
      )
    );
  };


  const createDataset = async (e) => {
    e.preventDefault();

    if (!datasetName.trim()) {
      setCreateError(
        "Dataset name is required."
      );
      return;
    }

    const validTestCases = testCases
      .filter(
        (testCase) =>
          testCase.input.trim() !== ""
      )
      .map((testCase) => ({
        input: testCase.input.trim(),
        expectedOutput:
          testCase.expectedOutput.trim(),
      }));


    if (validTestCases.length === 0) {
      setCreateError(
        "Add at least one test case with an input."
      );
      return;
    }


    try {
      setCreateLoading(true);
      setCreateError("");

      const token =
        localStorage.getItem("token");

      const response = await api.post(
        "/datasets",
        {
          name: datasetName.trim(),
          description:
            datasetDescription.trim(),
          testCases: validTestCases,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setDatasets(
        (currentDatasets) => [
          response.data.dataset,
          ...currentDatasets,
        ]
      );


      setShowCreateDataset(false);

    } catch (error) {
      setCreateError(
        error.response?.data?.message ||
        "Failed to create dataset"
      );

    } finally {
      setCreateLoading(false);
    }
  };


  useEffect(() => {
    fetchDatasets();
  }, []);


  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-7xl">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
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
              Build reusable test sets for
              evaluating your AI agents.
            </p>

          </div>


          <button
            onClick={openCreateDataset}
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
              Create a dataset to start
              testing agents with multiple
              test cases.
            </p>

          </div>

        ) : (

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {datasets.map((dataset) => (

              <div
              onClick={() => navigate(`/datasets/${dataset._id}`)}
                key={dataset._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/30"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Database size={20} />
                  </div>


                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                    {dataset.testCases?.length || 0}
                    {" "}tests
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


     
      {showCreateDataset && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">


            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900 px-6 py-5">

              <div>

                <p className="text-sm font-medium text-violet-400">
                  Evaluation dataset
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Create new dataset
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowCreateDataset(false)
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>


            <form
              onSubmit={createDataset}
              className="space-y-6 p-6"
            >


              {createError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {createError}
                </div>
              )}


              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Dataset name
                </label>

                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) =>
                    setDatasetName(
                      e.target.value
                    )
                  }
                  placeholder="Customer Support Tests"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={datasetDescription}
                  onChange={(e) =>
                    setDatasetDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe what this dataset evaluates..."
                  rows="3"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                />

              </div>


            
              <div>

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold">
                      Test cases
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Add prompts and their
                      expected outputs.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={addTestCase}
                    className="flex shrink-0 items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/15"
                  >
                    <Plus size={15} />

                    Add test case
                  </button>

                </div>


                <div className="mt-4 space-y-4">

                  {testCases.map(
                    (testCase, index) => (

                      <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
                      >

                        <div className="flex items-center justify-between">

                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Test case{" "}
                            {index + 1}
                          </p>


                          <button
                            type="button"
                            onClick={() =>
                              removeTestCase(
                                index
                              )
                            }
                            disabled={
                              testCases.length ===
                              1
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </div>


                        <div className="mt-4">

                          <label className="mb-2 block text-xs font-medium text-slate-400">
                            Input
                          </label>

                          <textarea
                            value={
                              testCase.input
                            }
                            onChange={(e) =>
                              updateTestCase(
                                index,
                                "input",
                                e.target.value
                              )
                            }
                            placeholder="How do I reset my password?"
                            rows="2"
                            className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                          />

                        </div>


                        <div className="mt-4">

                          <label className="mb-2 block text-xs font-medium text-slate-400">
                            Expected output
                          </label>

                          <textarea
                            value={
                              testCase.expectedOutput
                            }
                            onChange={(e) =>
                              updateTestCase(
                                index,
                                "expectedOutput",
                                e.target.value
                              )
                            }
                            placeholder="Expected behavior or answer..."
                            rows="2"
                            className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/60"
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              <div className="flex gap-3 border-t border-white/10 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowCreateDataset(false)
                  }
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createLoading
                    ? "Creating..."
                    : "Create dataset"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default DatasetsPage;