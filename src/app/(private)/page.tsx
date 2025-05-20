"use client";

import {
  allNoteAtom,
} from "@/atom/noteAtom";
import { userAtom } from "@/atom/userAtom";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {  useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import CardItem from "@/components/card/CardItem";
import { Note } from "@prisma/client";
import DialogDetail from "@/components/dialogDetail/DialogDetail";
import { useFetchNotes } from "@/hooks/useFetchNotes";
import { useNoteAccordion } from "@/hooks/noteAccordion";

export default function Home() {
  const user = useAtomValue(userAtom);
  const notes = useAtomValue(allNoteAtom);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  //データ取得のカスタムフック
  useFetchNotes();

  //ノートのアコーディオン
  const noteAccordion = useNoteAccordion();
  //確認用
  useEffect(() => {
    console.log(selectedNote);
  }, [, selectedNote]);

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
          <Card
            key={item.value}
            className="bg-gray-100 w-full h-auto rounded-lg p-4 flex flex-col gap-4"
          >
            <AccordionItem value={item.value}>
              <AccordionTrigger className="font-bold text-lg p-1">
                {item.title}
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-2 p-0">
                {item.notes.length === 0 ? (
                  <div className="flex h-full">
                    <p className="text-gray-500">No notes</p>
                  </div>
                ) : (
                  item.notes.map((note) => (
                    <CardItem
                      key={note.id}
                      id={note.id}
                      title={note.title}
                      startDate={note.startDate}
                      endDate={note.endDate}
                      handleSelectedNote={handleSelectedNote}
                    />
                  ))
                )}
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
      {selectedNote && (
        <DialogDetail
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
        />
      )}
    </div>
  );
}
