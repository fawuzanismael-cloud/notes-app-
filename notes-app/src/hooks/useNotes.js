import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

export function useNotes() {
  const [notes, setNotes] = useLocalStorage("notes", []);

  const add = useCallback(
    ({ title = "", body = "" }) => {
      const now = Date.now();
      const note = {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        pinned: false,
        archived: false,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [note, ...prev]);
      return note;
    },
    [setNotes]
  );

  const update = useCallback(
    (id, changes) =>
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...changes, updatedAt: Date.now() } : n))
      ),
    [setNotes]
  );

  const remove = useCallback(
    (id) => setNotes((prev) => prev.filter((n) => n.id !== id)),
    [setNotes]
  );

  // Derived: pinned notes that haven't been archived.
  const pinned = useMemo(() => notes.filter((n) => n.pinned && !n.archived), [notes]);

  return { notes, add, update, remove, pinned };
}
