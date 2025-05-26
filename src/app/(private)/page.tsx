"use client";

import { allNoteAtom } from "@/atom/noteAtom";
import { userAtom } from "@/atom/userAtom";
import { Accordion } from "@/components/ui/accordion";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Note } from "@prisma/client";
import DialogDetail from "@/components/dialog/DialogDetail";
import { useFetchNotes } from "@/hooks/useFetchNotes";
import { useNoteAccordion } from "@/hooks/noteAccordion";
import { deleteNote } from "@/_server-actions/note/deleteNote";
import AccordionCard from "@/components/card/AccordionCard";
import MoreDialog from "@/components/dialog/MoreDialog";

export type MORE_CATEGORY =
  | "todayNotes"
  | "comingUpNotes"
  | "unscheduledNotes"

export default function Home() {
  const user = useAtomValue(userAtom);
  const notes = useAtomValue(allNoteAtom);
  console.log(notes);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [moreDialogCategory, setMoreDialogCategory] =
    useState<MORE_CATEGORY>("todayNotes");

  useEffect(() => {
    console.log(moreDialogCategory);
  }, [moreDialogCategory]);

  const [moreDialog, setMoreDialog] = useState(false);

  //データ取得のカスタムフック
  const { refetchNotes } = useFetchNotes();

  //ノートのアコーディオン
  const noteAccordion = useNoteAccordion();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSelectedNote = (id: string) => {
    const filteredNotes = notes.filter((note) => note.id === id);
    setSelectedNote(filteredNotes[0]);
  };

  const handleDeleteNote = async (id: string) => {
    const result = await deleteNote(id);
    if (result.success) {
      setSelectedNote(null);
      setMoreDialog(false);
      refetchNotes();
    } else {
      console.error(result.error);
    }
  };

  const handleCloseMoreDialog = () => {
    setMoreDialog(false);
    setMoreDialogCategory("todayNotes");
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* コンテナ */}
      <Accordion
        type="single"
        collapsible
        className="w-[60%] flex flex-col gap-4"
      >
        {noteAccordion.map((item) => (
          <AccordionCard
            key={item.id}
            item={item}
            handleSelectedNote={handleSelectedNote}
            setMoreDialog={setMoreDialog}
            setMoreDialogCategory={setMoreDialogCategory}
          />
        ))}
      </Accordion>
      {selectedNote && (
        <DialogDetail
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          handleDeleteNote={handleDeleteNote}
        />
      )}
      {moreDialog && (
        <MoreDialog
          moreDialog={moreDialog}
          moreDialogCategory={moreDialogCategory}
          setMoreDialog={setMoreDialog}
          handleSelectedNote={handleSelectedNote}
          handleCloseMoreDialog={handleCloseMoreDialog}
        />
      )}
    </div>
  );
}
