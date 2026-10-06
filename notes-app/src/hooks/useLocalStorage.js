import { useCallback, useEffect, useState } from "react";

function read(key, initial) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? initial : JSON.parse(raw);
  } catch {
    return initial;
  }
}

/** useState that persists to localStorage and syncs across tabs. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => read(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) setValue(read(key, initialValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback((next) => setValue(next), []);
  return [value, set];
}
