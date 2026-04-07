import { create } from "zustand";

const USERNAME_KEY = "arcade_username";

const getInitialUsername = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
};

export const useUserStore = create((set) => ({
  username: getInitialUsername(),
  setUsername: (username) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USERNAME_KEY, username);
    }
    set({ username });
  },
  clearUsername: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USERNAME_KEY);
    }
    set({ username: null });
  },
}));
