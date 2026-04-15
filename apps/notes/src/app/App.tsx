import { useEffect, useMemo, useState } from 'preact/hooks';
import { AppShell } from '../components/AppShell';
import { registerSW } from './registerSW';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_PREFIX } from '../lib/constants';
import { NoteList, type Note } from '../features/notes/NoteList';

export function App() {
  useEffect(() => {
    registerSW();
  }, []);

  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useLocalStorage<Note[]>(`${STORAGE_PREFIX}items`, []);

  const orderedNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes]
  );

  const canAdd = draft.trim().length > 0;

  function addNote() {
    const text = draft.trim();
    if (!text) return;

    const now = new Date().toISOString();
    setNotes([
      {
        id: crypto.randomUUID(),
        text,
        updatedAt: now
      },
      ...notes
    ]);
    setDraft('');
  }

  function deleteNote(id: string) {
    setNotes(notes.filter((note) => note.id !== id));
  }

  return (
    <AppShell>
      <section class="grid">
        <div class="card">
          <label for="note-text">Nueva nota</label>
          <textarea
            id="note-text"
            rows={5}
            value={draft}
            onInput={(event) => setDraft((event.target as HTMLTextAreaElement).value)}
            placeholder="Escribe una nota..."
          />
          <div style="margin-top: 1rem;">
            <button disabled={!canAdd} onClick={addNote}>Guardar nota</button>
          </div>
        </div>

        <div class="card">
          <h2>Notas guardadas</h2>
          <NoteList notes={orderedNotes} onDelete={deleteNote} />
        </div>
      </section>
    </AppShell>
  );
}
