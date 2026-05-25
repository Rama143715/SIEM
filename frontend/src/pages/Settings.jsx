import { useEffect, useState } from "react";
import { BookOpen, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function SettingPanel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-sky-300">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function InfoRow({ label, value, warning = false }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-3">
      <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${warning ? "border-amber-500/30 bg-amber-500/10 text-amber-300" : "border-sky-500/30 bg-sky-500/10 text-sky-300"}`}>
        {value}
      </span>
    </div>
  );
}

function TextInput({ label, type = "text", value, onChange, autoComplete }) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-1 block text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
      />
    </label>
  );
}

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
  }, [user]);

  async function onProfileSubmit(event) {
    event.preventDefault();
    setMessage("");
    const result = await updateProfile({ email, full_name: fullName });
    setMessage(result.ok ? "Profile updated." : result.error);
  }

  async function onPasswordSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    const result = await changePassword({
      current_password: currentPassword,
      new_password: newPassword,
    });

    if (result.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed. Next change is due in 15 days.");
      return;
    }

    setMessage(result.error);
  }

  async function onLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  const daysRemaining = user?.password_days_remaining ?? 15;
  const passwordStatus = daysRemaining === 0 ? "Change due now" : `${daysRemaining} days left`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.22em] text-sky-300">Settings</p>
        <h2 className="text-2xl font-semibold text-slate-100">Account & Project</h2>
        <p className="max-w-3xl text-sm text-slate-400">
          Manage access, login/logout, and the 15-day password change cycle.
        </p>
      </div>

      {message ? (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          {message}
        </div>
      ) : null}

      <SettingPanel title="Access" icon={ShieldCheck}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-3">
            <InfoRow label="Signed in as" value={user?.full_name || user?.email || "SIEM Admin"} />
            <InfoRow label="Email" value={user?.email || "admin@siem.local"} />
            <InfoRow label="Role" value={user?.role || "admin"} />
            <InfoRow label="Password cycle" value={passwordStatus} warning={daysRemaining <= 3} />
          </div>

          <form onSubmit={onProfileSubmit} className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <h4 className="text-sm font-semibold text-slate-100">Change User Name / Email</h4>
            <TextInput label="Full name" value={fullName} onChange={setFullName} autoComplete="name" />
            <TextInput label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60"
            >
              Save Access
            </button>
          </form>
        </div>
      </SettingPanel>

      <SettingPanel title="Login & Logout" icon={LogOut}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">Current session</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {user ? `${user.full_name || user.email} is signed in` : "No user signed in"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Password should be changed once every 15 days.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4" />
                Login Page
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <form onSubmit={onPasswordSubmit} className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <h4 className="text-sm font-semibold text-slate-100">Change Password</h4>
            <TextInput label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
            <TextInput label="New password" type="password" value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            <TextInput label="Confirm new password" type="password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              Change Password
            </button>
          </form>
        </div>
      </SettingPanel>

      <SettingPanel title="About Project" icon={BookOpen}>
        <div className="space-y-3 text-sm leading-6 text-slate-300">
          <p>
            AI SIEM Platform is a lab Security Operations Center application for collecting security logs,
            detecting suspicious activity, creating alerts, and supporting analyst investigation.
          </p>
          <p>
            The project uses a React frontend, Node.js backend, PostgreSQL database, Redis, detection rules,
            incident tracking, and AI-assisted analysis to demonstrate a real-world SIEM workflow.
          </p>
          <p>
            This Settings page lets an authenticated user update profile details, change the password,
            and track the required 15-day password rotation cycle.
          </p>
        </div>
      </SettingPanel>
    </div>
  );
}
