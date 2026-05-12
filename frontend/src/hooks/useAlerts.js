import { useEffect } from "react";
import { connectSocket, getSocket } from "./useSocket";
import useAlertsStore from "../store/useAlertsStore";

export default function useAlerts() {
  const addLiveAlert = useAlertsStore((state) => state.addLiveAlert);

  useEffect(() => {
    const socket = connectSocket();
    if (!socket) {
      return undefined;
    }

    socket.on("new_alert", addLiveAlert);

    return () => {
      const current = getSocket();
      if (current) {
        current.off("new_alert", addLiveAlert);
      }
    };
  }, [addLiveAlert]);
}