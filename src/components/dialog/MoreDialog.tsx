import { MORE_CATEGORY } from "@/app/(private)/page";
import {
  comingUpNoteAtom,
  todayNoteAtom,
  unscheduledNoteAtom,
} from "@/atom/noteAtom";
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
import { deleteManyNoteCard } from "@/_server-actions/note/deleteManyNoteCard";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useFetchNotes } from "@/hooks/useFetchNotes";

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
  const [selectedCard, setSelectedCard] = useState<string[]>([]);

  const todayNotes = useAtomValue(todayNoteAtom);
  const comingUpNotes = useAtomValue(comingUpNoteAtom);
  const unscheduledNotes = useAtomValue(unscheduledNoteAtom);

  const { refetchNotes } = useFetchNotes();

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

  useEffect(() => {
    if(!moreDialog) {
      setSelectedCard([]);
    }
  }, [moreDialog]);

  const handleSelectCard = (id: string) => {
    if (selectedCard.includes(id)) {
      setSelectedCard((prev) => prev.filter((cardId) => cardId !== id));
    } else {
      setSelectedCard((prev) => [...prev, id]);
    }
    console.log(selectedCard);
  };

  const handleDeleteManyCard = async () => {
    const res = await deleteManyNoteCard(selectedCard);

    if (res.message) {
      toast.success(res.message);
      setSelectedCard([]);
      refetchNotes();
      setMoreDialog(false);
    }

    if (res.error) {
      toast.error(res.error);
    }
  };

  return (
    <Dialog open={moreDialog}>
      <DialogContent className="w-[60%] h-[70%] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex justify-between">
            <DialogTitle>{moreDialogCategory}</DialogTitle>
            {selectedCard.length > 0 && (
              <div className="flex items-center gap-2">
                <span>{selectedCard.length}件選択中</span>
                <Button variant={"destructive"} onClick={handleDeleteManyCard}>
                  削除
                </Button>
              </div>
            )}
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
                <Checkbox
                  checked={selectedCard.includes(note.id)}
                  onCheckedChange={() => handleSelectCard(note.id)}
                />
                <CardItem
                  id={note.id}
                  title={note.title}
                  startDate={note.startDate}
                  endDate={note.endDate}
                  unScheduled={note.unScheduled}
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
