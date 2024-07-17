import { Note } from "@/app/lib/types";
import { CreateNote, DeleteNote } from "@/app/components/buttons";
import { useState } from "react";
import { TextInputElement } from "./text-input-element";

export function NoteCard({
  window,
  notes,
  hidden,
}: {
  window: Date;
  notes: Note[];
  hidden: boolean;
}) {
  const [content, setContent] = useState("");
  const [recipientList, setrecipientList] = useState("");
  return (
    <div
      className="bg-slate-400 relative top-0 left-0 min-w-[25dvw] min-h-[50dvh] z-10 px-1 py-1 text-md font-semibold rounded-md opacity-90"
      hidden={hidden}
    >
      <div className="text-center text-xl font-semibold">Notes</div>
      <div className="text-md font-normal max-w-[25dvw] max-h-[25dvh] overflow-auto space-y-1">
        {notes.map((note) => (
          <div key={note.id}>
            <div className="flex flex-row place-content-center space-x-1">
              <div className="grow font-semibold">{note.sender.name}</div>
              <div className="">Sent at {note.timeSent.toLocaleString()}</div>
              <DeleteNote labl="Delete" noteId={note.id} />
            </div>

            <div>{note.content}</div>
          </div>
        ))}
      </div>

      <div className="h-1 mx-12 bg-slate-700"></div>
      <div className="text-center text-xl font-semibold">Create new note</div>
      <div className="space-y-1">
        <div className="font-semibold text-md">Content</div>
        <TextInputElement
          name="content"
          value={content}
          placeholder="Enter note content"
          handleChange={(e) => setContent(e.target.value)}
          disabled={false}
        />
        <div className="font-semibold text-md">
          Recipients (must be followers or users you&apos;re following)
        </div>
        <TextInputElement
          name="recipientList"
          value={recipientList}
          placeholder="Enter list of recipients, separated by ';'"
          handleChange={(e) => setrecipientList(e.target.value)}
          disabled={false}
        />
        <CreateNote
          content={content}
          position={window}
          recipientList={recipientList}
          labl="Create note"
        />
      </div>
    </div>
  );
}
