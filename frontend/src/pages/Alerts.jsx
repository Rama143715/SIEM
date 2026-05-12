import { useEffect, useMemo, useState } from "react";
import AlertCard from "../components/alerts/AlertCard";
import AlertTriage from "../components/alerts/AlertTriage";
import useAlertsStore from "../store/useAlertsStore";
import useAlerts from "../hooks/useAlerts";
import { ackAlert, resolveAlert, bulkAck } from "../api/alerts.api";

export default function Alerts() {
  const alerts = useAlertsStore((state) => state.alerts);
  const fetchAlerts = useAlertsStore((state) => state.fetchAlerts);
  const [selectedIds, setSelectedIds] = useState([]);

  useAlerts();

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const alertIds = useMemo(() => alerts.map((alert) => alert.id), [alerts]);

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => alertIds.includes(id)));
  }, [alertIds]);

  const toggleSelect = (id) => {
    setSelectedIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  return (
    <div className="space-y-4">
      <AlertTriage
        selectedCount={selectedIds.length}
        onBulkAcknowledge={async () => {
          await bulkAck(selectedIds);
          await fetchAlerts();
        }}
      />

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-2">
            <label className="mb-2 flex items-center gap-2 px-2 text-xs text-slate-300">
              <input type="checkbox" checked={selectedIds.includes(alert.id)} onChange={() => toggleSelect(alert.id)} />
              Select for bulk triage
            </label>
            <AlertCard
              alert={alert}
              onAcknowledge={async (id) => {
                await ackAlert(id);
                await fetchAlerts();
              }}
              onResolve={async (id) => {
                await resolveAlert(id);
                await fetchAlerts();
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}