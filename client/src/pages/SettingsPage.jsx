import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    UserRound,
    Mail,
    LockKeyhole,
    ShieldCheck,
    LogOut,
    Save,
    KeyRound,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import api from "../services/api";

function SettingsPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [profileLoading, setProfileLoading] =
        useState(false);

    const [profileError, setProfileError] =
        useState("");

    const [profileSuccess, setProfileSuccess] =
        useState("");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    const [passwordError, setPasswordError] =
        useState("");

    const [passwordSuccess, setPasswordSuccess] =
        useState("");

    const [pageLoading, setPageLoading] =
        useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setPageLoading(true);

                const token =
                    localStorage.getItem("token");

                const response = await api.get(
                    "/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setName(
                    response.data.user?.name || ""
                );

                setEmail(
                    response.data.user?.email || ""
                );
            } catch (error) {
                setProfileError(
                    error.response?.data?.message ||
                    "Failed to load account details"
                );
            } finally {
                setPageLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        setProfileError("");
        setProfileSuccess("");

        if (!name.trim() || !email.trim()) {
            setProfileError(
                "Name and email are required."
            );
            return;
        }

        try {
            setProfileLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await api.patch(
                "/auth/profile",
                {
                    name: name.trim(),
                    email: email.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedUser =
                response.data.user;

            setName(updatedUser.name);
            setEmail(updatedUser.email);

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setProfileSuccess(
                response.data.message ||
                "Profile updated successfully"
            );
        } catch (error) {
            setProfileError(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        setPasswordError("");
        setPasswordSuccess("");

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setPasswordError(
                "Please complete all password fields."
            );
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (
            newPassword !== confirmPassword
        ) {
            setPasswordError(
                "New passwords do not match."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await api.patch(
                "/auth/password",
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            setPasswordError(
                error.response?.data?.message ||
                "Failed to change password"
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="border-b border-white/10">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">
                            Back to dashboard
                        </span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
                            <ShieldCheck size={18} />
                        </div>

                        <span className="font-bold">
                            AgentProof
                            <span className="text-violet-400">
                                {" "}
                                AI
                            </span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div>
                    <p className="text-sm font-medium text-violet-400">
                        Account settings
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Settings
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        Manage your AgentProof account,
                        security, and authentication
                        preferences.
                    </p>
                </div>

                {pageLoading ? (
                    <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-slate-400">
                        <LoaderCircle
                            className="animate-spin"
                            size={20}
                        />
                        Loading account settings...
                    </div>
                ) : (
                    <div className="mt-8 space-y-6">
                        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            <div className="border-b border-white/10 p-5 sm:p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                        <UserRound size={21} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Account information
                                        </h2>

                                        <p className="mt-1 text-sm leading-6 text-slate-400">
                                            Update the name and email
                                            associated with your account.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={
                                    handleProfileUpdate
                                }
                                className="space-y-5 p-5 sm:p-6"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">
                                            Name
                                        </label>

                                        <div className="relative">
                                            <UserRound
                                                size={17}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                            />

                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60"
                                                placeholder="Your name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">
                                            Email
                                        </label>

                                        <div className="relative">
                                            <Mail
                                                size={17}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                            />

                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {profileError && (
                                    <Message
                                        type="error"
                                        message={profileError}
                                    />
                                )}

                                {profileSuccess && (
                                    <Message
                                        type="success"
                                        message={
                                            profileSuccess
                                        }
                                    />
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={
                                            profileLoading
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                    >
                                        {profileLoading ? (
                                            <LoaderCircle
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={17} />
                                        )}

                                        {profileLoading
                                            ? "Saving..."
                                            : "Save changes"}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            <div className="border-b border-white/10 p-5 sm:p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                        <LockKeyhole
                                            size={21}
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Change password
                                        </h2>

                                        <p className="mt-1 text-sm leading-6 text-slate-400">
                                            Verify your current password
                                            before creating a new one.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={
                                    handlePasswordChange
                                }
                                className="space-y-5 p-5 sm:p-6"
                            >
                                <PasswordField
                                    label="Current password"
                                    value={currentPassword}
                                    onChange={
                                        setCurrentPassword
                                    }
                                />

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <PasswordField
                                        label="New password"
                                        value={newPassword}
                                        onChange={
                                            setNewPassword
                                        }
                                    />

                                    <PasswordField
                                        label="Confirm new password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={
                                            setConfirmPassword
                                        }
                                    />
                                </div>

                                <p className="text-xs leading-5 text-slate-500">
                                    Your new password must contain
                                    at least 6 characters and must
                                    be different from your current
                                    password.
                                </p>

                                {passwordError && (
                                    <Message
                                        type="error"
                                        message={
                                            passwordError
                                        }
                                    />
                                )}

                                {passwordSuccess && (
                                    <Message
                                        type="success"
                                        message={
                                            passwordSuccess
                                        }
                                    />
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={
                                            passwordLoading
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                    >
                                        {passwordLoading ? (
                                            <LoaderCircle
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <KeyRound
                                                size={17}
                                            />
                                        )}

                                        {passwordLoading
                                            ? "Updating..."
                                            : "Update password"}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <section className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-5 sm:p-6">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                <div>
                                    <h2 className="font-semibold">
                                        Sign out
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        End your current AgentProof
                                        session on this browser.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                                >
                                    <LogOut size={17} />
                                    Sign out
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}

function PasswordField({
    label,
    value,
    onChange,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
                {label}
            </label>

            <div className="relative">
                <LockKeyhole
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                    type="password"
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60"
                    placeholder="••••••••"
                />
            </div>
        </div>
    );
}

function Message({
    type,
    message,
}) {
    const success =
        type === "success";

    return (
        <div
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${success
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
        >
            {success ? (
                <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0"
                />
            ) : (
                <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                />
            )}

            <span>{message}</span>
        </div>
    );
}

export default SettingsPage;