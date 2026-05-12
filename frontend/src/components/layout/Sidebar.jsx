import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScrollText,
  Siren,
  ShieldAlert,
  BrainCircuit,
  Workflow,
  Settings,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/alerts", label: "Alerts", icon: Siren },
  { to: "/incidents", label: "Incidents", icon: ShieldAlert },
  { to: "/ai-analysis", label: "AI Analysis", icon: BrainCircuit },
  { to: "/rules", label: "Rules", icon: Workflow },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-siem-panel/90 p-4">
      <div className="mb-8 rounded-lg bg-slate-900 p-4 text-center">
        <p className="text-xs uppercase tracking-widest text-sky-400">SOC Platform</p>
        <h1 className="text-lg font-bold">AI SIEM</h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? "bg-sky-700/30 text-sky-300" : "text-slate-300 hover:bg-slate-800"}`}
            >
              <Icon size={16} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}