export type Note = {
  id: string;
  text: string;
  updatedAt: string;
};

export function NoteList(props: {
  notes: Note[];
  onDelete: (id: string) => void;
}) {
  if (props.notes.length === 0) {
    return <p>No hay notas todavía.</p>;
  }

  return (
    <div class="grid">
      {props.notes.map((note) => (
        <article class="card" key={note.id}>
          <p>{note.text}</p>
          <small>Actualizada: {new Date(note.updatedAt).toLocaleString()}</small>
          <div style="margin-top: 1rem;">
            <button onClick={() => props.onDelete(note.id)}>Eliminar</button>
          </div>
        </article>
      ))}
    </div>
  );
}
