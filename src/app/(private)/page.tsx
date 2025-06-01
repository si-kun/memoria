"use client";

import { allNoteAtom, dialogNoteAtom } from "@/atom/noteAtom";
import { userAtom } from "@/atom/userAtom";
import { Accordion } from "@/components/ui/accordion";
import { useAtom, useAtomValue } from "jotai";
import { useNoteAccordion } from "@/hooks/noteAccordion";
import AccordionCard from "@/components/card/AccordionCard";
import { useMoreDialog } from "@/hooks/useMoreDialog";
import { useState } from "react";
import { searchTarmAtom } from "@/atom/searchAtom";
import SearchArea from "@/components/search/SearchArea";
import { useDebounce } from "@/hooks/useDebounce";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Note } from "@prisma/client";
import CalendarNoteDialog from "@/components/dialog/CalendarNoteDialog";
export type MORE_CATEGORY =
  | "todayNotes"
  | "comingUpNotes"
  | "unscheduledNotes"
  | "favoriteNotes"
  | "trashNotes";

export default function Home() {
  const [calendarNoteDialog, setCalendarNoteDialog] = useState(false);

  const user = useAtomValue(userAtom);
  const notes = useAtomValue(allNoteAtom);
  const [dialogNote, setDialogNote] = useAtom(dialogNoteAtom);

  const { setMoreDialog } = useMoreDialog();

  const [moreDialogCategory, setMoreDialogCategory] =
    useState<MORE_CATEGORY>("todayNotes");

  //ノートのアコーディオン
  const noteAccordion = useNoteAccordion();
  const searchTerm = useAtomValue(searchTarmAtom);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSelectedNote = (id: string) => {
    const filteredNotes = notes.filter((note) => note.id === id);
    setDialogNote(filteredNotes[0]);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      {debouncedSearchTerm !== "" ? (
        <SearchArea />
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
          <Accordion type="single" collapsible className="flex flex-col gap-4">
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
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={notes.map((note) => ({
              id: note.id,
              title: note.title,
              start: note.startDate ?? undefined,
              end: note.endDate ?? undefined,
            }))}
            eventClick={(info) => {
              const noteId = info.event.id;
              const clickedNote = notes.find((note) => note.id === noteId);
              setCalendarNoteDialog(true);
              setDialogNote(clickedNote as Note);
            }}
          />
          {/* {calendarNoteDialog && ( */}
          <CalendarNoteDialog
            note={dialogNote as Note}
            calendarNoteDialog={calendarNoteDialog}
            setCalendarNoteDialog={setCalendarNoteDialog}
          />
          {/* )} */}
        </div>
      )}
    </div>
  );
}
