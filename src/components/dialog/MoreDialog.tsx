import { MORE_CATEGORY } from "@/app/(private)/page";
import {
  comingUpNoteAtom,
  todayNoteAtom,
  unscheduledNoteAtom,
} from "@/atom/noteAtom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Note } from "@prisma/client";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import CardItem from "../card/CardItem";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";

interface MoreDialogProps {
  moreDialog: boolean;
  moreDialogCategory: MORE_CATEGORY;
  setMoreDialog: (moreDialog: boolean) => void;
  handleSelectedNote: (id: string) => void;
}

const MoreDialog = ({
  moreDialog,
  moreDialogCategory,
  setMoreDialog,
  handleSelectedNote,
}: MoreDialogProps) => {
  const [categoryNotes, setCategoryNotes] = useState<Note[]>([]);

  const todayNotes = useAtomValue(todayNoteAtom);
  const comingUpNotes = useAtomValue(comingUpNoteAtom);
  const unscheduledNotes = useAtomValue(unscheduledNoteAtom);

  useEffect(() => {
    switch (moreDialogCategory) {
      case "todayNotes":
        setCategoryNotes(todayNotes);
        break;
      case "comingUpNotes":
        setCategoryNotes(comingUpNotes);
        break;
      case "unscheduledNotes":
        setCategoryNotes(unscheduledNotes);
        break;
    }
  }, [moreDialogCategory, todayNotes, comingUpNotes, unscheduledNotes]);

  return (
    <Dialog open={moreDialog}>
      <DialogContent className="w-[60%] h-[70%] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex justify-between">
            <DialogTitle>{moreDialogCategory}</DialogTitle>
            <DialogClose asChild onClick={() => setMoreDialog(false)}>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* 🔥←ここでScrollAreaがflex-1で残り全部になる */}
        <ScrollArea className="flex-1 h-[70%]">
          <div className="flex flex-col gap-3 pb-3">
            {categoryNotes.map((note) => (
              <div key={note.id} className="flex items-center gap-1 w-full">
                <Checkbox />
                <CardItem
                  id={note.id}
                  title={note.title}
                  startDate={note.startDate}
                  endDate={note.endDate}
                  handleSelectedNote={handleSelectedNote}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MoreDialog;
