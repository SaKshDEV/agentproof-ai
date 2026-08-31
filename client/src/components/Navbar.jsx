import { useState } from 'react'
import React from 'react'

const Navbar = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="border-b border-white/10 bg-slate-950">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <h1 className="text-xl text-white font-bold">
                    Agent Proof
                    <span className="text-violet-400">AI</span>
                </h1>
                <div className="hidden items-center gap-8 md:flex">
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
                <div className="hidden items-center gap-3 md:flex">
                    <button className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
                        Sign in
                    </button>

                    <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500">
                        Get Started
                    </button>

                </div>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white transition hover:bg-white/5 md:hidden"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>
            {menuOpen && (
                <div className="border-t border-white/10 bg-slate-950 px-6 py-5 md:hidden">

                    <div className="flex flex-col gap-4">

                        <a
                            href="#features"
                            className="text-sm text-slate-400 hover:text-white"
                        >
                            Features
                        </a>

                        <a
                            href="#evaluations"
                            className="text-sm text-slate-400 hover:text-white"
                        >
                            Evaluations
                        </a>

                        <a
                            href="#pricing"
                            className="text-sm text-slate-400 hover:text-white"
                        >
                            Pricing
                        </a>

                        <button className="mt-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500">
                            Get Started
                        </button>

                    </div>

                </div>
            )}

        </nav>
    )
}

export default Navbar