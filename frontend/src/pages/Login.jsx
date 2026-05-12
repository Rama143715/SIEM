import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [email, setEmail] = useState("admin@siem.local");
  const [password, setPassword] = useState("changeme123");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const result = await login(email, password);
    if (!result.ok) {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <ShieldCheck className="mx-auto mb-2 text-sky-400" size={36} />
          <h1 className="text-2xl font-bold">AI SIEM Platform</h1>
          <p className="mt-1 text-sm text-slate-400">SOC analyst access portal</p>
        </div>

        <label className="mb-3 block text-sm">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2" required />
        </label>

        <label className="mb-3 block text-sm">
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2" required />
        </label>

        {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

        <button disabled={loading} type="submit" className="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}