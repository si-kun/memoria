"use client";

import { allNoteAtom } from "@/atom/noteAtom";
import { userAtom } from "@/atom/userAtom";
import { Accordion } from "@/components/ui/accordion";
import { useAtomValue } from "jotai";
import { useNoteAccordion } from "@/hooks/noteAccordion";
import AccordionCard from "@/components/card/AccordionCard";
import { useMoreDialog } from "@/hooks/useMoreDialog";
import { useTrashNote } from "@/hooks/useTrashNote";
import { useState } from "react";

export type MORE_CATEGORY = "todayNotes" | "comingUpNotes" | "unscheduledNotes" | "favoriteNotes" | "trashNotes";

export default function Home() {
  const user = useAtomValue(userAtom);
  const notes = useAtomValue(allNoteAtom);

  const { setSelectedNote } = useTrashNote();

  const [moreDialogCategory, setMoreDialogCategory] =
    useState<MORE_CATEGORY>("todayNotes");

  const { setMoreDialog } = useMoreDialog();

  //ノートのアコーディオン
  const noteAccordion = useNoteAccordion();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSelectedNote = (id: string) => {
    const filteredNotes = notes.filter((note) => note.id === id);
    setSelectedNote(filteredNotes[0]);
  };

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
            moreDialogCategory={moreDialogCategory}
          />
        ))}
      </Accordion>
    </div>
  );
}
