import { Note } from "@/app/lib/types";

export function NoteCard({
  window,
  notes,
  hidden,
}: {
  window: Date;
  notes: Note[];
  hidden: boolean;
}) {
  return (
    <div
      className="bg-slate-400 relative top-0 left-0 min-w-[20dvw] min-h-[40dvh] z-10 px-1 py-1 text-md font-semibold rounded-md opacity-90"
      hidden={hidden}
    >
      <div className="text-center text-xl font-semibold">Notes</div>
      <div className="h-1 mx-12 bg-slate-700"></div>
      {notes.map((note) => (
        <div key={note.id}>
          {note.id + " | "}
          {note.content}
        </div>
      ))}

      <div className="h-1 mx-12 bg-slate-700"></div>
      <div className="text-center text-xl font-semibold">Create new note</div>
    </div>
  );
}
