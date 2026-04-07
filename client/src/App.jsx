import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { dark } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = dark ? "dark" : "light";
    root.style.colorScheme = dark ? "dark" : "light";

    const grid = document.querySelector(".arcade-grid");
    const scanlines = document.querySelector(".arcade-scanlines");
    if (!grid) {
      const overlay = document.createElement("div");
      overlay.className = "arcade-grid";
      document.body.appendChild(overlay);
    }
    if (!scanlines) {
      const overlay = document.createElement("div");
      overlay.className = "arcade-scanlines";
      document.body.appendChild(overlay);
    }
    if (!document.querySelector(".arcade-glow")) {
      const overlay = document.createElement("div");
      overlay.className = "arcade-glow";
      document.body.appendChild(overlay);
    }
  }, [dark]);

  return <AppRouter />;
}

export default App;
