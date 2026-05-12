import { create } from "zustand";

const useSocketStore = create((set) => ({
  connected: false,
  socket: null,
  setSocket: (socket) => set({ socket }),
  setConnected: (connected) => set({ connected }),
}));

export default useSocketStore;