import {
    Link2,
    Database,
    Play,
    BarChart3,
} from "lucide-react"
import React from 'react'

const steps = [
   {
    id: 1,
    number: "01",
    icon: Link2,
    title: "Connect your agent",
    description:
      "Add your AI endpoint or configure an agent that you want AgentProof to evaluate.",
  },
  {
    id: 2,
    number: "02",
    icon: Database,
    title: "Create a test dataset",
    description:
      "Define questions, expected behaviour and evaluation criteria for your agent.",
  },
  {
    id: 3,
    number: "03",
    icon: Play,
    title: "Run evaluations",
    description:
      "Execute test cases and measure accuracy, latency, failures and hallucinations.",
  },
  {
    id: 4,
    number: "04",
    icon: BarChart3,
    title: "Analyze and compare",
    description:
      "Explore detailed results and compare different prompts, models and agent versions.",
  },

];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-950 px-6 pt-12 pb-24"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
            Simple workflow
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            From connection to confidence.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400">
            Connect your AI agent, define what good looks like and let
            AgentProof continuously measure its reliability.
          </p>

        </div>

        <div className="relative mt-16">

          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-white/10 lg:block" />

          <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="relative text-center"
                >

                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-slate-900 text-violet-400 shadow-lg shadow-black/20">
                    <Icon size={23} />
                  </div>

                  <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-violet-400">
                    STEP {step.number}
                  </p>

                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}


export default HowItWorks