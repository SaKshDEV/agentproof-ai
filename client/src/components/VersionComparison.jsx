import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import ComparisonCard from "./ComparisonCard";

function VersionComparison() {
  return (
    <section
      id="evaluations"
      className="relative bg-slate-950 px-6 py-24"
    >

      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-16 lg:grid-cols-2">


          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
              Regression testing
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Know which version is actually better.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Compare prompts, models and agent versions across the metrics
              that matter before deciding what goes to production.
            </p>

            <div className="mt-8 space-y-4">

              <Benefit text="Measure quality changes between versions" />

              <Benefit text="Catch regressions before deployment" />

              <Benefit text="Compare cost, latency and reliability together" />

            </div>

            <button className="group mt-9 flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
              Compare evaluations

              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </button>

          </div>

          <div className="relative">

            <div className="absolute inset-0 bg-violet-600/10 blur-3xl" />

            <div className="relative grid gap-4 sm:grid-cols-2">

              <ComparisonCard
                version="Version A"
                model="Prompt v3 · Model A"
                accuracy="87.4%"
                latency="2.4s"
                cost="$0.008"
                hallucination="7.1%"
              />

              <ComparisonCard
                version="Version B"
                model="Prompt v4 · Model B"
                accuracy="92.8%"
                latency="1.6s"
                cost="$0.004"
                hallucination="2.9%"
                recommended={true}
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

function Benefit({ text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
        <CheckCircle2 size={15} />
      </div>

      <span className="text-sm text-slate-300">
        {text}
      </span>

    </div>
  );
}

export default VersionComparison;