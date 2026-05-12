import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#38bdf8"];

export default function SeverityDonut({ data = [] }) {
  const normalized = data.map((item) => ({
    name: item.severity,
    value: Number(item.count),
  }));

  return (
    <div className="h-72 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="mb-3 text-sm font-semibold">Severity Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={normalized} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" label>
            {normalized.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}