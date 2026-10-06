import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const ThemeContext = createContext(null);

const systemDefault = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("theme", systemDefault());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
