import {
    BrainCircuit,
    ShieldCheck,
    Timer,
    GitCompareArrows,
    TriangleAlert,
    BarChart3,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const features = [
    {
        id: 1,
        icon: BrainCircuit,
        title: "AI-Powered Evaluation",
        description:
            "Automatically evaluate agent responses for correctness, relevance and overall quality.",

    },
    {
        id: 2,
        icon: TriangleAlert,
        title: "Hallucination Detection",
        description:
            "Identify unsupported or fabricated responses before they reach real users.",

    },
    {
        id: 3,
        icon: Timer,
        title: "Latency Monitoring",
        description:
            "Measure response times and uncover slow requests across your AI workflows.",

    },
    {
        id: 4,
        icon: GitCompareArrows,
        title: "Version Comparison",
        description:
            "Compare prompts, models and agent versions to understand which performs better.",

    },
    {
        id: 5,
        icon: ShieldCheck,
        title: "Reliability Testing",
        description:
            "Run repeatable test suites and catch regressions before deploying to production.",

    },
    {
        id: 6,
        icon: BarChart3,
        title: "Evaluation Analytics",
        description:
            "Track accuracy, failures, latency and quality trends from a single dashboard.",

    },
];

function Features() {
    return (
        <section
            id="features"
            className=" relative bg-slate-950 px-6 pt-12 py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
                        Everything you need

                    </p>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Test every part of your AI agent.

                    </h2>
                    <p className="mt-5 text-base leading-7 text-slate-400">
                        AgentProof gives developers the tools to measure quality,
                        detect failures and confidently ship AI systems to production.

                    </p>
                </div>
                <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <FeatureCard
                                key={feature.id}
                                icon={<Icon size={21} />}
                                title={feature.title}
                                description={feature.description} />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Features;