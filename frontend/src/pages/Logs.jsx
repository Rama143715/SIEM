import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogFilters from "../components/logs/LogFilters";
import LogStream from "../components/logs/LogStream";
import useLogsStore from "../store/useLogsStore";
import useLiveLogs from "../hooks/useLiveLogs";

export default function Logs() {
  const navigate = useNavigate();
  const logs = useLogsStore((state) => state.logs);
  const filters = useLogsStore((state) => state.filters);
  const selectedIds = useLogsStore((state) => state.selectedIds);
  const isStreaming = useLogsStore((state) => state.isStreaming);
  const fetchLogs = useLogsStore((state) => state.fetchLogs);
  const setFilter = useLogsStore((state) => state.setFilter);
  const toggleSelected = useLogsStore((state) => state.toggleSelected);
  const toggleStreaming = useLogsStore((state) => state.toggleStreaming);

  useLiveLogs();

  useEffect(() => {
    fetchLogs({ page: 1, limit: 100 });
  }, [fetchLogs]);

  const selectedLogs = logs.filter((log) => selectedIds.includes(log.id));

  return (
    <div className="space-y-4">
      <LogFilters
        filters={filters}
        onChange={setFilter}
        onSearch={() => fetchLogs({ ...filters, page: 1 })}
        onToggleStreaming={toggleStreaming}
        isStreaming={isStreaming}
        selectedCount={selectedIds.length}
        onAnalyzeSelected={() => navigate("/ai-analysis", { state: { selectedLogs } })}
      />

      <LogStream logs={logs} selectedIds={selectedIds} onSelect={toggleSelected} />
    </div>
  );
}