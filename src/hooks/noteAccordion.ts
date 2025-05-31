import {
  comingUpNoteAtom,
  favoriteNoteAtom,
  todayNoteAtom,
  trashNoteAtom,
  unscheduledNoteAtom,
} from "@/atom/noteAtom";
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
  const trashNotes = useAtomValue(trashNoteAtom);
  const favoriteNotes = useAtomValue(favoriteNoteAtom);

  return [
    {
      id: "todayNotes",
      title: "Today",
      notes: todayNotes,
      value: "item-1",
    },
    {
      id: "comingUpNotes",
      title: "Coming up",
      notes: comingUpNotes,
      value: "item-2",
    },
    {
      id: "unscheduledNotes",
      title: "Unscheduled",
      notes: unscheduledNotes,
      value: "item-3",
    },
    {
      id: "favoriteNotes",
      title: "Favorites",
      notes: favoriteNotes,
      value: "item-4",
    },
    {
      id: "trashNotes",
      title: "Trash",
      notes: trashNotes,
      value: "item-5"
    }
  ] satisfies NoteAccordionItem[];
};
