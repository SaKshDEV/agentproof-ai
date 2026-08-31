import React from 'react'

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-slate-950 px-6 py-24">
            <div className=" absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"></div>
            <div className="mx-auto z-10 max-w-7xl">
                <div className='mx-auto mb-6 w-fit rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300'>
                    AI Agent reliability platform
                </div>
                    

                
                <h1 className="mx-auto max-w-4xl text-center text-5xl font-bold leading-tight text-white md:text-6xl">
                    Test your AI agents before
                    <span className="text-violet-400">your users do</span>

                </h1>
                <p className="mx-auto mt-6 mx-w-2xl text-center text-lg leading-8 text-slate-400">
                    Evaluate accuracy, detect hallucination,measure latency and
                    catch failures before deploying your AI agents to production

                </p>
                <div className="mt-8 flex-col flex items-center justify-center gap-4 sm:flex-row">
                    <button className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500">
                        Start Evaluating

                    </button >
                    <button className="rounded-lg border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10">
                        View Demo

                    </button>

                </div>
                <div className='mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500'>
                    <span>✓ No credit card</span>
                    <span>✓ Fast setup</span>
                    <span>✓ Production focused</span>
                </div>
            </div>
        </section>
    )
}

export default Hero