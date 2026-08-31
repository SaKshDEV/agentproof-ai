import React from 'react'

const Navbar = () => {
  return (
    <nav className="border-b border-white/10 bg-slate-950">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="text-xl text-white font-bold">
                    Agent Proof
                    <span className="text-violet-400">AI</span>
                </h1>
                <div className="flex items-center gap-8">
                    <a href="#features"
                        className="text-sm text-slate-400 transition hover:text-white">
                        Features

                    </a>
                    <a
                        className="text-sm text-slate-400 transition hover:text-white"
                        href="#evalution">
                        Evalution
                    </a>
                    <a
                        className="text-sm text-slate-400 transition hover:text-white "
                        href="#pricing">
                        pricing
                    </a>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="rounded-lg pc-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">Sign-in</button>
                    <button
                        className="rounded-lg px-4 py-2 text-sm font semibold text-slate-950 transition hover:bg-slate-200">Get Started
                        </button>
                </div>
            </div>
        </nav>
  )
}

export default Navbar