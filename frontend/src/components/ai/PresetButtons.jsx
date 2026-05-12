const presets = [
  { key: "threat_hunt", label: "Threat Hunt" },
  { key: "anomaly", label: "Anomaly" },
  { key: "forensics", label: "Forensics" },
  { key: "triage", label: "Triage" },
  { key: "ioc", label: "IOC Extraction" },
];

export default function PresetButtons({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.key}
          onClick={() => onSelect(preset.key)}
          className="rounded border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}