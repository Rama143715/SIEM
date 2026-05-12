import { LogOut, Wifi, WifiOff } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";
import useSocketStore from "../../store/useSocketStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const connected = useSocketStore((state) => state.connected);

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400">Security Operations Center</p>
        <h2 className="text-lg font-semibold">Real-Time Threat Monitoring</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${connected ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? "Live" : "Offline"}
        </div>

        <div className="text-right text-sm">
          <p className="font-medium">{user?.full_name || user?.email}</p>
          <p className="text-xs uppercase text-slate-400">{user?.role}</p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
}