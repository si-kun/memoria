"use client";

import { getAllNote } from "@/_server-actions/getAllNote";
import {
  allNoteAtom,
  comingUpNoteAtom,
  folderAtom,
  todayNoteAtom,
  unscheduledNoteAtom,
} from "@/atom/noteAtom";
import { userAtom } from "@/atom/userAtom";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import CardItem from "@/components/card/CardItem";
import { Note } from "@prisma/client";
import { getTodayNotes } from "@/_server-actions/note/getTodayNotes";
import { getComingupNotes } from "@/_server-actions/note/getComingupNotes";
import { getFolder } from "@/_server-actions/getFolder";
import { getUnscheduled } from "@/_server-actions/note/getUnscheduled";
import DialogDetail from "@/components/dialogDetail/DialogDetail";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);
  const [notes, setNotes] = useAtom(allNoteAtom);
  const [todayNotes, setTodayNotes] = useAtom(todayNoteAtom);
  const [comingUpNotes, setComingUpNotes] = useAtom(comingUpNoteAtom);
  const [unscheduledNotes, setUnscheduledNotes] = useAtom(unscheduledNoteAtom);
  const [filterNotes, setFilterNotes] = useState<Note[]>([]);
  const [folder, setFolder] = useAtom(folderAtom);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const noteAccordion = [
    {
      id: "comingUpNotes",
      title: "Coming up",
      notes: comingUpNotes,
      value: "item-1",
    },
    {
      id: "todayNotes",
      title: "Today",
      notes: todayNotes,
      value: "item-2",
    },
    {
      id: "unscheduledNotes",
      title: "Unscheduled",
      notes: unscheduledNotes,
      value: "item-3",
    },
  ];

  useEffect(() => {
    if (!user) return;
    const userId = user?.id;

    if (userId) {
    }
    const fetchNotes = async () => {
      if (userId) {
        const result = await getAllNote(userId);

        if (result.success && result.data) {
          setNotes(result.data);
        }
      }
    };

    const fetchTodayNotes = async () => {
      if (userId) {
        const result = await getTodayNotes(userId);

        if (result.success && result.data) {
          setTodayNotes(result.data);
        }
      }
    };

    const fetchComingUpNotes = async () => {
      if (userId) {
        const result = await getComingupNotes(userId);

        if (result.success && result.data) {
          setComingUpNotes(result.data);
        }
      }
    };

    const fetchUnscheduledNotes = async () => {
      if (userId) {
        const result = await getUnscheduled(userId);

        if (result.success && result.data) {
          setUnscheduledNotes(result.data);
        }
      }
    };

    const fetchFolder = async () => {
      if (userId) {
        const result = await getFolder(userId);

        if (result.success && result.data) {
          setFolder(result.data);
        }
      }
    };

    fetchNotes();
    fetchTodayNotes();
    fetchComingUpNotes();
    fetchUnscheduledNotes();
    fetchFolder();
  }, [
    setNotes,
    setTodayNotes,
    setComingUpNotes,
    setUnscheduledNotes,
    setFolder,
    user,
  ]);

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
