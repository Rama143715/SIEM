import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AnalysisPanel from "../components/ai/AnalysisPanel";
import PresetButtons from "../components/ai/PresetButtons";
import { runAnalysis, getAnalysisHistory } from "../api/ai.api";

export default function AIAnalysis() {
  const location = useLocation();
  const selectedLogs = location.state?.selectedLogs || [];
  const [analysisType, setAnalysisType] = useState("triage");
  const [rawText, setRawText] = useState(selectedLogs.map((item) => JSON.stringify(item)).join("\n"));
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    const data = await getAnalysisHistory();
    setHistory(data.analyses || []);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 xl:col-span-1">
        <h3 className="text-sm font-semibold">AI Runbook</h3>

        <PresetButtons onSelect={setAnalysisType} />

        <label className="block text-xs text-slate-300">
          Analysis Type
          <select value={analysisType} onChange={(event) => setAnalysisType(event.target.value)} className="mt-1 w-full rounded bg-slate-800 px-3 py-2 text-sm">
            <option value="threat_hunt">threat_hunt</option>
            <option value="anomaly">anomaly</option>
            <option value="forensics">forensics</option>
            <option value="compliance">compliance</option>
            <option value="ioc">ioc</option>
            <option value="triage">triage</option>
            <option value="incident">incident</option>
          </select>
        </label>

        <textarea
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          rows={14}
          className="w-full rounded bg-slate-800 p-3 text-xs"
          placeholder="Paste logs or query context here"
        />

        <button
          onClick={async () => {
            setLoading(true);
            try {
              const data = await runAnalysis({ analysis_type: analysisType, raw_text: rawText });
              setOutput(data.result || "");
              await loadHistory();
            } finally {
              setLoading(false);
            }
          }}
          className="w-full rounded bg-sky-600 px-3 py-2 text-sm font-semibold"
          disabled={loading || !rawText.trim()}
        >
          {loading ? "Running Analysis..." : "Run Analysis"}
        </button>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">History</h4>
          <div className="max-h-48 space-y-1 overflow-auto">
            {history.map((item) => (
              <button
                key={item.id}
                className="w-full rounded bg-slate-800 px-2 py-1 text-left text-xs hover:bg-slate-700"
                onClick={() => setOutput(item.output_data || "")}
              >
                {item.analysis_type} - {new Date(item.created_at).toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="xl:col-span-2">
        <AnalysisPanel output={output} loading={loading} />
      </section>
    </div>
  );
}