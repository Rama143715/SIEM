import { useEffect } from "react";
import useLogsStore from "../store/useLogsStore";
import { connectSocket, getSocket } from "./useSocket";

export default function useLiveLogs() {
  const addLiveLogs = useLogsStore((state) => state.addLiveLogs);
  const isStreaming = useLogsStore((state) => state.isStreaming);

  useEffect(() => {
    if (!isStreaming) {
      return undefined;
    }

    const socket = connectSocket();
    if (!socket) {
      return undefined;
    }

    socket.emit("subscribe_logs", { filters: {} });
    socket.on("new_logs", addLiveLogs);

    return () => {
      const current = getSocket();
      if (current) {
        current.off("new_logs", addLiveLogs);
        current.emit("unsubscribe_logs");
      }
    };
  }, [addLiveLogs, isStreaming]);
}