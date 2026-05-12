import useAuthStore from "../store/useAuthStore";

export default function Settings() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-2 text-sm font-semibold">Platform Settings</h3>
        <p className="text-sm text-slate-300">Current role: <span className="font-semibold">{user?.role}</span></p>
        <p className="text-sm text-slate-400">Admin users can manage rules and sensitive operations.</p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-2 text-sm font-semibold">Integration Endpoints</h3>
        <ul className="space-y-1 text-sm text-slate-300">
          <li>API: <code>{import.meta.env.VITE_API_URL || "http://localhost:3001/api"}</code></li>
          <li>Socket.IO: <code>{import.meta.env.VITE_SOCKET_URL || "http://localhost:3001"}</code></li>
          <li>Syslog UDP: <code>514</code></li>
        </ul>
      </section>
    </div>
  );
}