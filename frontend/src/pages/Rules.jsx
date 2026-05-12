import { useEffect, useState } from "react";
import { fetchRules, createRule, toggleRule, deleteRule, testRule } from "../api/rules.api";

const defaultRule = {
  name: "",
  description: "",
  severity: "HIGH",
  type: "pattern",
  conditions: { field: "message", operator: "contains", value: "failed login" },
  actions: [{ type: "create_alert" }],
  mitre_tactic: "Credential Access",
  mitre_tech: "T1110",
};

const templates = [
  { name: "Brute Force", type: "threshold", conditions: { field: "message", operator: "contains", value: "failed login", threshold: 10, timeWindowSeconds: 60 }, severity: "HIGH" },
  { name: "SQL Injection", type: "regex", conditions: { pattern: "union\\s+select|1=1" }, severity: "CRITICAL" },
  { name: "Ransomware", type: "regex", conditions: { pattern: "(encrypt|ransom|locked)" }, severity: "CRITICAL" },
];

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState(defaultRule);
  const [testInput, setTestInput] = useState("failed login from 10.10.1.5");
  const [testResult, setTestResult] = useState(null);

  const load = async () => {
    const data = await fetchRules();
    setRules(data.rules || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-3 text-sm font-semibold">Rule Builder</h3>

        <div className="mb-3 flex flex-wrap gap-2">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => setForm((state) => ({ ...state, ...template, name: `${template.name} Rule` }))}
              className="rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
            >
              {template.name}
            </button>
          ))}
        </div>

        <form
          className="grid grid-cols-1 gap-2 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await createRule(form);
            setForm(defaultRule);
            await load();
          }}
        >
          <input value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} placeholder="Rule name" className="rounded bg-slate-800 px-3 py-2 text-sm" required />
          <input value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} placeholder="Description" className="rounded bg-slate-800 px-3 py-2 text-sm" />

          <select value={form.severity} onChange={(event) => setForm((state) => ({ ...state, severity: event.target.value }))} className="rounded bg-slate-800 px-3 py-2 text-sm">
            <option>CRITICAL</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
            <option>INFO</option>
          </select>

          <select value={form.type} onChange={(event) => setForm((state) => ({ ...state, type: event.target.value }))} className="rounded bg-slate-800 px-3 py-2 text-sm">
            <option value="pattern">pattern</option>
            <option value="threshold">threshold</option>
            <option value="regex">regex</option>
            <option value="field_match">field_match</option>
            <option value="correlation">correlation</option>
          </select>

          <input
            value={form.conditions.value || form.conditions.pattern || ""}
            onChange={(event) => setForm((state) => ({
              ...state,
              conditions: state.type === "regex"
                ? { ...state.conditions, pattern: event.target.value }
                : { ...state.conditions, value: event.target.value, field: state.conditions.field || "message", operator: state.conditions.operator || "contains" },
            }))}
            placeholder="Condition value / pattern"
            className="rounded bg-slate-800 px-3 py-2 text-sm md:col-span-2"
          />

          <button type="submit" className="rounded bg-sky-600 px-3 py-2 text-sm font-semibold md:col-span-2">Create Rule</button>
        </form>

        <div className="mt-4 rounded-lg border border-slate-700 p-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Test Rule</h4>
          <textarea value={testInput} onChange={(event) => setTestInput(event.target.value)} rows={3} className="w-full rounded bg-slate-800 p-2 text-xs" />
          <button
            onClick={async () => {
              const result = await testRule({
                rule: form,
                sample_logs: [{ message: testInput }],
              });
              setTestResult(result);
            }}
            className="mt-2 rounded bg-emerald-600 px-3 py-1.5 text-xs font-semibold"
          >
            Test Rule
          </button>
          {testResult ? <pre className="mt-2 overflow-auto rounded bg-slate-950 p-2 text-xs">{JSON.stringify(testResult, null, 2)}</pre> : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-3 text-sm font-semibold">Existing Rules</h3>
        <div className="space-y-2">
          {rules.map((rule) => (
            <article key={rule.id} className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-xs text-slate-400">{rule.type} | {rule.severity}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { await toggleRule(rule.id); await load(); }} className="rounded bg-amber-600 px-2 py-1 text-xs font-semibold">{rule.is_enabled ? "Disable" : "Enable"}</button>
                  <button onClick={async () => { await deleteRule(rule.id); await load(); }} className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}