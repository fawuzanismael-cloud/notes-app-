import { useState } from "react";
import { useNotes } from "./hooks/useNotes.js";
import { useTheme } from "./context/ThemeContext.jsx";

const VIEWS = ["All", "Pinned", "Archived"];

export default function App() {
  const { notes, add, update, remove, pinned } = useNotes();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState("All");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);

  const visible = {
    All: notes.filter((n) => !n.archived),
    Pinned: pinned,
    Archived: notes.filter((n) => n.archived),
  }[view];

  const counts = {
    All: notes.filter((n) => !n.archived).length,
    Pinned: pinned.length,
    Archived: notes.filter((n) => n.archived).length,
  };

  const reset = () => {
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) return;
    if (editingId) update(editingId, { title: title.trim(), body: body.trim() });
    else add({ title, body });
    reset();
  };

  const startEdit = (n) => {
    setEditingId(n.id);
    setTitle(n.title);
    setBody(n.body);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const emptyText = {
    All: "No notes yet. Write one above.",
    Pinned: "Nothing pinned. Pin a note to keep it here.",
    Archived: "Archive is empty.",
  }[view];

  return (
    <main className="wrap">
      <header className="top">
        <h1>Notes</h1>
        <button className="ghost" onClick={toggleTheme} aria-pressed={theme === "dark"}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <form className="composer" onSubmit={submit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          aria-label="Title"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write something down"
          rows={3}
          aria-label="Note body"
        />
        <div className="row">
          <button type="submit" className="primary">
            {editingId ? "Save changes" : "Add note"}
          </button>
          {editingId && (
            <button type="button" className="ghost" onClick={reset}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <nav className="tabs" aria-label="Note views">
        {VIEWS.map((v) => (
          <button
            key={v}
            className={v === view ? "tab on" : "tab"}
            aria-current={v === view ? "page" : undefined}
            onClick={() => setView(v)}
          >
            {v} <span className="count">{counts[v]}</span>
          </button>
        ))}
      </nav>

      {visible.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <ul className="list">
          {visible.map((n) => (
            <li key={n.id} className={n.pinned ? "note pinned" : "note"}>
              {n.title && <h2>{n.title}</h2>}
              {n.body && <p>{n.body}</p>}
              <div className="row actions">
                <button className="ghost" onClick={() => update(n.id, { pinned: !n.pinned })}>
                  {n.pinned ? "Unpin" : "Pin"}
                </button>
                <button className="ghost" onClick={() => startEdit(n)}>
                  Edit
                </button>
                <button className="ghost" onClick={() => update(n.id, { archived: !n.archived })}>
                  {n.archived ? "Restore" : "Archive"}
                </button>
                <button className="ghost danger" onClick={() => remove(n.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
