import { comingUpNoteAtom, todayNoteAtom, unscheduledNoteAtom } from "@/atom/noteAtom";
import { Note } from "@prisma/client";
import { useAtomValue } from "jotai";


interface NoteAccordionItem {
    id: string;
    title: string;
    notes: Note[];
    value: string;
}

export const useNoteAccordion = () => {
    const todayNotes = useAtomValue(todayNoteAtom);
    const comingUpNotes = useAtomValue(comingUpNoteAtom);
    const unscheduledNotes = useAtomValue(unscheduledNoteAtom);
  
    return [
      {
        id: "todayNotes",
        title: "Today",
        notes: todayNotes,
        value: "item-2",
      },
      {
        id: "comingUpNotes",
        title: "Coming up",
        notes: comingUpNotes,
        value: "item-1",
      },
      {
        id: "unscheduledNotes",
        title: "Unscheduled",
        notes: unscheduledNotes,
        value: "item-3",
      },
    ] satisfies NoteAccordionItem[];
  };
