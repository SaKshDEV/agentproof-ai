import MetricCard from "./MetricCard";
import React from 'react'

const evaluationResult = [
    {
        id: 1,
        testCase: "Refund policy",
        status: "Passed",
        score: "98%",
        latency: "1.1s",
    },
    {
        id: 2,
        testCase: " Order cancellation",
        status: "Passed",
        score: "96%",
        latency: "1.4s",
    },
    {
        id: 3,
        testCase: " Account recovery",
        status: "Review",
        score: "72%",
        latency: "2.2s",
    },

]

const DashboardPreview = () => {
    return (
        <section className="bg-slate-950 px-6 pb-24">
            <div className="mx-auto max-w-6xl">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                        <div>
                            <p className="text-sm text-slate-500">
                                Production Support Agent

                            </p>
                            <h2 className="mt-1 text-lg font-semibold text-white">
                                Evaluation run #1284

                            </h2>
                        </div>
                        <div className=" rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                            Completed
                        </div>
                    </div>
                    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                            title="Reliability"
                            value="94.2%"
                            change="+3.8%" />
                        <MetricCard
                            title="Accuracy"
                            value="96.8%"
                            change="+2.1%" />
                        <MetricCard
                            title="Avg Latency"
                            value="1.42s"
                            change="-18%" />
                        <MetricCard
                            title="Hallucination Rate"
                            value="2.7%"
                            change="-4.3%" />

                    </div>
                    <div className="px-6 pb-6">
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <div className="grid grid-cols-4 bg-white/5 px-5 py-3 text-sm text-slate-500">
                                <span>Test Case</span>
                                <span>Result</span>
                                <span>Score</span>
                                <span>Latency</span>

                            </div>
                            {evaluationResult.map((result)=>(
                                <div
                                key={result.id}
                                className="grid grid-cols-4 border-t border-white/5 px-5 py-4 text-sm ">
                                    <span className="text-slate-300">
                                        {result.testCase}
                                    </span>
                                    <span 
                                    className={
                                        result.status === "Passed"
                                        ? "text-emerald-400"
                                        : "text-amber-400"
                                    }>
                                        {result.status}
                                    </span>
                                    <span className="text-slate-300">
                                        {result.score}
                                    </span>
                                    <span className="text-slate-500">
                                        {result.latency}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DashboardPreview