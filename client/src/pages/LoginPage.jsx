import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import api from "../services/api"

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };


return (
  <div className="min-h-screen bg-slate-950 text-white">

    <div className="grid min-h-screen lg:grid-cols-2">

      <div className="flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          <Link
            to="/"
            className="mb-10 flex w-fit items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <ShieldCheck size={20} />
            </div>

            <span className="text-xl font-bold">
              AgentProof
              <span className="text-violet-400">AI</span>
            </span>
          </Link>


          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in to manage your agents and continue your evaluations.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-violet-400 hover:text-violet-300"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Create account
            </Link>
          </p>

        </div>

      </div>

      <div className="relative hidden overflow-hidden border-l border-white/10 bg-slate-900 lg:flex">

        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative z-10 flex w-full items-center justify-center p-12">

          <div className="max-w-lg">

            <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
              AI reliability platform
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-tight">
              Catch AI failures before your users do.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Evaluate accuracy, monitor latency, detect hallucinations
              and compare agent versions from one workspace.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-2xl font-bold">94.2%</p>
                <p className="mt-1 text-sm text-slate-500">
                  Reliability score
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-2xl font-bold">1.42s</p>
                <p className="mt-1 text-sm text-slate-500">
                  Average latency
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}

export default LoginPage;