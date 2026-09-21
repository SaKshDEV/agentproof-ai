import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Database,
  FileText,
  Pencil,
  Trash2,
  X,
  Plus,
} from "lucide-react";

import api from "../services/api";

function DatasetDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] =
    useState("");

  const [editTestCases, setEditTestCases] =
    useState([]);

  const [editLoading, setEditLoading] =
    useState(false);

  const [editError, setEditError] =
    useState("");

  const [deleteLoading, setDeleteLoading] =
    useState(false);


  const fetchDataset = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        `/datasets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDataset(response.data.dataset);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load dataset"
      );

    } finally {
      setLoading(false);
    }
  };


  const openEditModal = () => {
    setEditName(dataset.name);

    setEditDescription(
      dataset.description || ""
    );

    setEditTestCases(
      dataset.testCases.map(
        (testCase) => ({
          input: testCase.input,
          expectedOutput:
            testCase.expectedOutput || "",
        })
      )
    );

    setEditError("");
    setShowEditModal(true);
  };


  const addEditTestCase = () => {
    setEditTestCases((current) => [
      ...current,
      {
        input: "",
        expectedOutput: "",
      },
    ]);
  };


  const removeEditTestCase = (
    indexToRemove
  ) => {
    if (editTestCases.length === 1) {
      return;
    }

    setEditTestCases((current) =>
      current.filter(
        (_, index) =>
          index !== indexToRemove
      )
    );
  };


  const updateEditTestCase = (
    indexToUpdate,
    field,
    value
  ) => {
    setEditTestCases((current) =>
      current.map(
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


  const updateDataset = async (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      setEditError(
        "Dataset name is required."
      );
      return;
    }

    const validTestCases =
      editTestCases
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
      setEditError(
        "Add at least one test case with an input."
      );
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const token =
        localStorage.getItem("token");

      const response = await api.put(
        `/datasets/${id}`,
        {
          name: editName.trim(),
          description:
            editDescription.trim(),
          testCases: validTestCases,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDataset(
        response.data.dataset
      );

      setShowEditModal(false);

    } catch (error) {
      setEditError(
        error.response?.data?.message ||
        "Failed to update dataset"
      );

    } finally {
      setEditLoading(false);
    }
  };


  const deleteDataset = async () => {
    const shouldDelete =
      window.confirm(
        "Are you sure you want to delete this dataset?"
      );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      await api.delete(
        `/datasets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/datasets");

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete dataset"
      );

    } finally {
      setDeleteLoading(false);
    }
  };


  useEffect(() => {
    fetchDataset();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8 text-slate-500">
        Loading dataset...
      </div>
    );
  }


  if (error && !dataset) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

        <div className="mx-auto max-w-5xl">

          <button
            onClick={() =>
              navigate("/datasets")
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to datasets
          </button>

          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">

      <div className="mx-auto max-w-5xl">

        <button
          onClick={() =>
            navigate("/datasets")
          }
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to datasets
        </button>


        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}


        
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Database size={21} />
              </div>


              <div>

                <p className="text-sm font-medium text-violet-400">
                  Evaluation dataset
                </p>

                <h1 className="mt-1 text-3xl font-bold">
                  {dataset.name}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {dataset.description ||
                    "No description provided."}
                </p>


                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">

                  <FileText size={14} />

                  {dataset.testCases?.length || 0}{" "}

                  {dataset.testCases?.length === 1
                    ? "test case"
                    : "test cases"}

                </div>

              </div>

            </div>


          
            <div className="flex shrink-0 gap-2">

              <button
                type="button"
                onClick={openEditModal}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <Pencil size={16} />
                Edit
              </button>


              <button
                type="button"
                onClick={deleteDataset}
                disabled={deleteLoading}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>


        
        <div className="mt-8">

          <p className="text-sm font-medium text-violet-400">
            Test cases
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Dataset contents
          </h2>


          {dataset.testCases?.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-sm text-slate-500">
              No test cases in this dataset.
            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {dataset.testCases.map(
                (testCase, index) => (

                  <div
                    key={
                      testCase._id ||
                      index
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                  >

                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                      Test case {index + 1}
                    </p>


                    <div className="mt-5">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Input
                      </p>

                      <div className="mt-2 rounded-xl border border-white/5 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                        {testCase.input}
                      </div>

                    </div>


                    <div className="mt-5">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Expected output
                      </p>

                      <div className="mt-2 rounded-xl border border-white/5 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                        {testCase.expectedOutput ||
                          "No expected output provided."}
                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>


     
      {showEditModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">


            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-900 px-6 py-5">

              <div>

                <p className="text-sm font-medium text-violet-400">
                  Dataset settings
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Edit dataset
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowEditModal(false)
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={19} />
              </button>

            </div>


            <form
              onSubmit={updateDataset}
              className="space-y-6 p-6"
            >

              {editError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {editError}
                </div>
              )}


              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Dataset name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
                />

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                  rows="3"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-violet-500/60"
                />

              </div>


              {/* EDIT TEST CASES */}
              <div>

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold">
                      Test cases
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Update prompts and expected outputs.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={addEditTestCase}
                    className="flex shrink-0 items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/15"
                  >
                    <Plus size={15} />
                    Add test case
                  </button>

                </div>


                <div className="mt-4 space-y-4">

                  {editTestCases.map(
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
                              removeEditTestCase(
                                index
                              )
                            }
                            disabled={
                              editTestCases.length === 1
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2 size={16} />
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
                              updateEditTestCase(
                                index,
                                "input",
                                e.target.value
                              )
                            }
                            rows="2"
                            placeholder="Test input..."
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
                              updateEditTestCase(
                                index,
                                "expectedOutput",
                                e.target.value
                              )
                            }
                            rows="2"
                            placeholder="Expected behavior or answer..."
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
                    setShowEditModal(false)
                  }
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
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

export default DatasetDetailPage;