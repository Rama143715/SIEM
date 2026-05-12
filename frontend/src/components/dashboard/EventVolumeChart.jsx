import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

export default function EventVolumeChart({ data = [] }) {
  const normalized = data.map((item) => ({
    hour: format(new Date(item.hour_bucket), "HH:mm"),
    count: Number(item.count),
  }));

  return (
    <div className="h-72 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="mb-3 text-sm font-semibold">Event Volume (24h)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={normalized}>
          <defs>
            <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="hour" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#38bdf8" fillOpacity={1} fill="url(#eventsGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}