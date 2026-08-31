import React from 'react'

const Hero = () => {
    return (
        <section className="bg-slate-950 px-6 py-24">
            <div className="mx-auto max-w-7xl">
                <p className="mb-5 text-center text-sm font-medium text-violet-400">
                    AI Agent reliability platform

                </p >
                <h1 className="mx-auto max-w-4xl text-center text-5xl font-bold leading-tight text-white">
                    Test your AI agents before
                    <span className="text-violet-400">your users do</span>

                </h1>
                <p className="mx-auto mt-6 mx-w-2xl text-center text-lg leading-8 text-slate-400">
                    Evaluate accuracy, detect hallucination,measure latency and
                    catch failures before deploying your AI agents to production

                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
                    <button className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500">
                        Start Evaluating

                    </button >
                    <button className="rounded-lg border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10">
                        View Demo

                    </button>

                </div>
            </div>
        </section>
    )
}

export default Hero