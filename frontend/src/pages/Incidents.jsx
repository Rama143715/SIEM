import { useEffect, useState } from "react";
import IncidentTable from "../components/incidents/IncidentTable";
import IncidentModal from "../components/incidents/IncidentModal";
import { fetchIncidents, createIncident } from "../api/incidents.api";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", severity: "MEDIUM" });

  const load = async () => {
    const data = await fetchIncidents();
    setIncidents(data.incidents || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <form
        className="grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 md:grid-cols-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await createIncident(form);
          setForm({ title: "", description: "", severity: "MEDIUM" });
          await load();
        }}
      >
        <input value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} placeholder="Incident title" className="rounded bg-slate-800 px-3 py-2 text-sm" required />
        <input value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} placeholder="Description" className="rounded bg-slate-800 px-3 py-2 text-sm" />
        <select value={form.severity} onChange={(event) => setForm((state) => ({ ...state, severity: event.target.value }))} className="rounded bg-slate-800 px-3 py-2 text-sm">
          <option>CRITICAL</option>
          <option>HIGH</option>
          <option>MEDIUM</option>
          <option>LOW</option>
          <option>INFO</option>
        </select>
        <button type="submit" className="rounded bg-sky-600 px-3 py-2 text-sm font-semibold">Create Incident</button>
      </form>

      <IncidentTable
        incidents={incidents}
        onOpen={(incident) => {
          setSelectedIncident(incident);
          setOpenModal(true);
        }}
      />

      <IncidentModal
        incident={selectedIncident}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedIncident(null);
        }}
      />
    </div>
  );
}