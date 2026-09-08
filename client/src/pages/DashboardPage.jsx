import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Bot,
  FlaskConical,
  Database,
  Settings,
  LogOut,
  Plus,
  Activity,
  ShieldCheck,
  Clock3,
  TriangleAlert,
} from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex min-h-screen">

     
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950 lg:flex lg:flex-col">

     
          <div className="flex h-20 items-center border-b border-white/10 px-6">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
              <ShieldCheck size={19} />
            </div>

            <span className="ml-3 text-lg font-bold">
              AgentProof
              <span className="text-violet-400"> AI</span>
            </span>

          </div>


         
          <nav className="flex-1 space-y-2 px-4 py-6">

            <SidebarItem
              icon={LayoutDashboard}
              label="Overview"
              active
            />

            <SidebarItem
              icon={Bot}
              label="Agents"
            />

            <SidebarItem
              icon={FlaskConical}
              label="Evaluations"
            />

            <SidebarItem
              icon={Database}
              label="Datasets"
            />

            <SidebarItem
              icon={Settings}
              label="Settings"
            />

          </nav>


          <div className="border-t border-white/10 p-4">

            <div className="mb-3 rounded-xl bg-white/[0.03] p-3">

              <p className="truncate text-sm font-medium text-white">
                {user?.name || "AgentProof User"}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {user?.email || "user@example.com"}
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={17} />

              Logout
            </button>

          </div>

        </aside>


        
        <main className="min-w-0 flex-1">

        
          <header className="flex h-20 items-center justify-between border-b border-white/10 px-6 lg:px-8">

            <div>
              <p className="text-sm text-slate-500">
                Workspace
              </p>

              <h1 className="mt-1 text-lg font-semibold">
                Production AI
              </h1>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500">
              <Plus size={17} />

              New evaluation
            </button>

          </header>


         
          <div className="p-6 lg:p-8">

           
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

              <div>
                <p className="text-sm font-medium text-violet-400">
                  Overview
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Welcome back, {user?.name || "there"}.
                </h2>

                <p className="mt-3 text-sm text-slate-400">
                  Monitor your AI agents and catch reliability issues before production.
                </p>
              </div>

            </div>


            {/* STATS */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                icon={Bot}
                label="Active Agents"
                value="3"
                detail="2 production"
              />

              <StatCard
                icon={Activity}
                label="Reliability"
                value="94.2%"
                detail="+3.8% this week"
              />

              <StatCard
                icon={Clock3}
                label="Avg. Latency"
                value="1.42s"
                detail="-18% this week"
              />

              <StatCard
                icon={TriangleAlert}
                label="Failed Tests"
                value="7"
                detail="3 need review"
              />

            </div>


            <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

             
              <section className="rounded-2xl border border-white/10 bg-white/[0.03]">

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                  <div>
                    <h3 className="font-semibold">
                      Recent evaluations
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Latest runs across your agents
                    </p>
                  </div>

                  <button className="text-sm font-medium text-violet-400 hover:text-violet-300">
                    View all
                  </button>

                </div>

                <div>
                  <EvaluationRow
                    name="Customer Support Agent"
                    score="96.8%"
                    status="Passed"
                    time="12 min ago"
                  />

                  <EvaluationRow
                    name="Refund Assistant"
                    score="91.4%"
                    status="Passed"
                    time="1 hour ago"
                  />

                  <EvaluationRow
                    name="Account Recovery Agent"
                    score="72.3%"
                    status="Review"
                    time="3 hours ago"
                  />
                </div>

              </section>


              
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <p className="text-sm font-medium text-violet-400">
                  Quick start
                </p>

                <h3 className="mt-3 text-xl font-semibold">
                  Run your first real evaluation.
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Connect an AI agent, create a test dataset and measure its reliability.
                </p>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/15">
                  <Plus size={17} />

                  Add your first agent
                </button>

              </section>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

function SidebarItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-violet-500/10 text-violet-300"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon size={18} />

      {label}
    </button>
  );
}


function StatCard({ icon: Icon, label, value, detail }) {
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

      <p className="mt-2 text-xs text-slate-500">
        {detail}
      </p>

    </div>
  );
}


function EvaluationRow({
  name,
  score,
  status,
  time,
}) {
  return (
    <div className="grid grid-cols-[1.5fr_0.6fr_0.7fr] items-center gap-4 border-b border-white/5 px-6 py-5 last:border-none">

      <div>
        <p className="text-sm font-medium text-white">
          {name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {time}
        </p>
      </div>

      <p className="text-sm font-semibold">
        {score}
      </p>

      <span
        className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
          status === "Passed"
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-400"
        }`}
      >
        {status}
      </span>

    </div>
  );
}

export default DashboardPage;