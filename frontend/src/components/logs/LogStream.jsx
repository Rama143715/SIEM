import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import LogRow from "./LogRow";

export default function LogStream({ logs, selectedIds, onSelect }) {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160,
    overscan: 8,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div>
      <div ref={parentRef} className="max-h-[72vh] overflow-auto rounded-lg border border-slate-800 bg-slate-950/40 p-2">
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          {virtualRows.map((virtualRow) => {
            const log = logs[virtualRow.index];
            if (!log) {
              return null;
            }

            return (
              <div
                key={virtualRow.key}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: "0.5rem",
                }}
              >
                <LogRow log={log} selected={selectedIds.includes(log.id)} onSelect={onSelect} />
              </div>
            );
          })}
        </div>
      </div>

      {logs.length === 0 ? <p className="mt-2 rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">No logs found.</p> : null}
    </div>
  );
}
