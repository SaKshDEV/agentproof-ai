function ComparisonCard({
    version,
    model,
    accuracy,
    latency,
    cost,
    hallucination,
    recommended,
}) {
    return (
        <div
            className={`relative rounded-2xl border p-6 ${recommended
                    ? "border-violet-500/40 bg-violet-500/[0.06]"
                    : "border-white/10 bg-white/[0.03]"
                }`}>
            {recommended && (<div className="absolute right-5 top-5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                Recommended

            </div>)}
            <p className="text-sm font-medium text-slate-500">
                {version}

            </p>
            <h3 className=" mt-2 text-xl font-semibold text-white"> 
                {model}

            </h3>
            <div className="mt-7 space-y-4">
                <MetricRow
                label="Accuracy"
                value={accuracy} />
                <MetricRow
                label="Avg. Latency"
                value={latency} />
                <MetricRow 
                label=" Cost/request"
                value={cost} />
                <MetricRow
                label="hallucination"
                value={hallucination} />
            </div>
        </div>
    )
}

function MetricRow({label,value}){
    return(
        <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-none last:pb-0">
            <span className="text-sm text-slate-400">
                {label}

            </span>
            <span className="text-sm font-semibold text-white">
                {value}

            </span>
        </div>
    )
}



export default ComparisonCard