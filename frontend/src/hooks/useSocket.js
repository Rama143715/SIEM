import { io } from "socket.io-client";
import useSocketStore from "../store/useSocketStore";

let socket;

export function connectSocket() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }

  if (socket) {
    return socket;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
    auth: {
      token: `Bearer ${token}`,
    },
  });

  useSocketStore.getState().setSocket(socket);

  socket.on("connect", () => {
    useSocketStore.getState().setConnected(true);
  });

  socket.on("disconnect", () => {
    useSocketStore.getState().setConnected(false);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  useSocketStore.getState().setSocket(null);
  useSocketStore.getState().setConnected(false);
}