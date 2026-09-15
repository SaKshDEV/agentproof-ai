import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    FlaskConical,
    Clock3,
    CheckCircle2,
    XCircle,
    Bot,
} from "lucide-react";

import api from "../services/api";

function EvaluationsPage() {
    const navigate = useNavigate();

    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEvaluations = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/evaluations", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEvaluations(response.data.evaluations);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load evaluations"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const successfulRuns = evaluations.filter(
        (evaluation) => evaluation.success
    ).length;

    const successRate = evaluations.length > 0
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


                <div className="mt-8">

                    <p className="text-sm font-medium text-violet-400">
                        Evaluation history
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Evaluation runs
                    </h1>

                    <p className="mt-3 text-sm text-slate-400">
                        Review previous AI agent tests and reliability results.
                    </p>

                </div>


                {error && (
                    <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}


                {/* SUMMARY CARDS */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <SummaryCard
                        icon={FlaskConical}
                        label="Total evaluations"
                        value={loading ? "..." : evaluations.length}
                    />

                    <SummaryCard
                        icon={CheckCircle2}
                        label="Success rate"
                        value={loading ? "..." : `${successRate}%`}
                    />

                    <SummaryCard
                        icon={Clock3}
                        label="Average latency"
                        value={
                            loading
                                ? "..."
                                : `${averageLatency} ms`
                        }
                    />

                </div>


                
                {loading ? (

                    <div className="mt-10 text-sm text-slate-500">
                        Loading evaluations...
                    </div>

                ) : evaluations.length === 0 ? (

                    <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

                        <FlaskConical
                            size={34}
                            className="mx-auto text-slate-600"
                        />

                        <h2 className="mt-4 text-lg font-semibold">
                            No evaluations yet
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Test an AI agent and its evaluation will appear here.
                        </p>

                        <button
                            onClick={() => navigate("/agents")}
                            className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-violet-500"
                        >
                            Go to agents
                        </button>

                    </div>

                ) : (

                    <div className="mt-8 space-y-4">

                        {evaluations.map((evaluation) => (

                            <div
                                key={evaluation._id}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                            >

                                
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                                    <div className="flex items-start gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                            <Bot size={18} />
                                        </div>

                                        <div>

                                            <h2 className="font-semibold">
                                                {evaluation.agent?.name ||
                                                    "Deleted agent"}
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {new Date(
                                                    evaluation.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex items-center gap-3">

                                        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                                            <Clock3 size={14} />
                                            {evaluation.latency} ms
                                        </div>

                                        {evaluation.success ? (
                                            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
                                                <CheckCircle2 size={14} />
                                                Success
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
                                                <XCircle size={14} />
                                                Failed
                                            </div>
                                        )}

                                    </div>

                                </div>


                                <div className="mt-6">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Input
                                    </p>

                                    <div className="mt-2 rounded-xl border border-white/5 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                                        {evaluation.input}
                                    </div>

                                </div>

                                <div className="mt-5">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Agent response
                                    </p>

                                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-white/5 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                                        {JSON.stringify(
                                            evaluation.output,
                                            null,
                                            2
                                        )}
                                    </pre>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}


function SummaryCard({
    icon: Icon,
    label,
    value,
}) {
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

        </div>
    );
}

export default EvaluationsPage;