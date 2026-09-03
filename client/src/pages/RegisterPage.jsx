import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Name:", name);
    console.log("Email:", email);

    console.log("Registration form valid");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Logo */}
            <Link
              to="/"
              className="mb-8 flex w-fit items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <ShieldCheck size={20} />
              </div>

              <span className="text-xl font-bold">
                AgentProof
                <span className="text-violet-400"> AI</span>
              </span>
            </Link>

            {/* Heading */}
            <h1 className="text-3xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Start testing and improving your AI agents with AgentProof.
            </p>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Saksham Gulati"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Create account
              </button>

            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative hidden overflow-hidden border-l border-white/10 bg-slate-900 lg:flex">

          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative z-10 flex w-full items-center justify-center p-12">

            <div className="max-w-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
                Built for reliable AI
              </p>

              <h2 className="mt-5 text-4xl font-bold leading-tight">
                Test confidently before going to production.
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                Build datasets, run evaluations and compare agent versions
                from one reliability workspace.
              </p>

              <div className="mt-10 space-y-4">

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-semibold">
                    ✓ Detect hallucinations
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Catch unsupported responses before users see them.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-semibold">
                    ✓ Compare agent versions
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Measure regressions across prompts and models.
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

export default RegisterPage;