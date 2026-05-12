import { useEffect, useState } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import EventVolumeChart from "../components/dashboard/EventVolumeChart";
import SeverityDonut from "../components/dashboard/SeverityDonut";
import ThreatMap from "../components/dashboard/ThreatMap";
import AssetGrid from "../components/dashboard/AssetGrid";
import { fetchStats, fetchTimeline, fetchTopSources, fetchSeverity, fetchAssets } from "../api/dashboard.api";
import { fetchAlerts } from "../api/alerts.api";
import { getSocket } from "../hooks/useSocket";

export default function Dashboard() {
  const [stats, setStats] = useState({ critical: 0, openAlerts: 0, eps: 0, blocked: 0 });
  const [timeline, setTimeline] = useState([]);
  const [topSources, setTopSources] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [assets, setAssets] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);

  const load = async () => {
    const [statsData, timelineData, sourcesData, severityData, assetsData, alertsData] = await Promise.all([
      fetchStats(),
      fetchTimeline(),
      fetchTopSources(),
      fetchSeverity(),
      fetchAssets(),
      fetchAlerts({ severity: "CRITICAL" }),
    ]);

    setStats(statsData);
    setTimeline(timelineData.timeline || []);
    setTopSources(sourcesData.sources || []);
    setSeverity(severityData.severity || []);
    setAssets(assetsData.assets || []);
    setRecentAlerts((alertsData.alerts || []).slice(0, 5));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      return undefined;
    }

    const onStats = (payload) => {
      setStats((current) => ({ ...current, ...payload }));
    };

    socket.on("stats_update", onStats);
    return () => {
      socket.off("stats_update", onStats);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Critical Threats" value={stats.critical} color="red" trend={12} />
        <MetricCard title="Open Alerts" value={stats.openAlerts} color="amber" />
        <MetricCard title="Events/sec" value={stats.eps} color="blue" />
        <MetricCard title="Threats Blocked" value={stats.blocked} color="green" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <EventVolumeChart data={timeline} />
        <SeverityDonut data={severity} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ThreatMap sources={topSources} />
        <AssetGrid assets={assets} />
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="mb-3 text-sm font-semibold">Recent Critical Alerts</h3>
        <div className="space-y-2">
          {recentAlerts.map((alert) => (
            <article key={alert.id} className="rounded-lg border border-slate-700 bg-slate-800/70 p-3">
              <p className="font-medium">{alert.title}</p>
              <p className="text-sm text-slate-300">{alert.detail}</p>
            </article>
          ))}
          {recentAlerts.length === 0 ? <p className="text-sm text-slate-400">No critical alerts.</p> : null}
        </div>
      </section>
    </div>
  );
}