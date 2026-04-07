import { create } from "zustand";

export const useStore = create((set) => ({
  currentGame: null,
  setCurrentGame: (game) => set({ currentGame: game }),
}));