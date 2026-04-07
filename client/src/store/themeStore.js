import { create } from "zustand";

const getInitialTheme = () => {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem("theme");
  if (saved === "light") return false;
  if (saved === "dark") return true;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
};

export const useThemeStore = create((set) => ({
  dark: getInitialTheme(),
  setTheme: (value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", value ? "dark" : "light");
    }
    set({ dark: value });
  },
  toggleTheme: () =>
    set((state) => {
      const next = !state.dark;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("theme", next ? "dark" : "light");
      }
      return { dark: next };
    }),
}));
