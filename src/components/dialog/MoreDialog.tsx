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
import MoreDialogSort from "../select/MoreDialogSort";
import { DialogDescription } from "@radix-ui/react-dialog";

interface MoreDialogProps {
  moreDialog: boolean;
  moreDialogCategory: MORE_CATEGORY;
  setMoreDialog: (moreDialog: boolean) => void;
  handleSelectedNote: (id: string) => void;
  handleCloseMoreDialog: () => void;
}

export type SortOptionType =
  "createdAt-asc"|
  "createdAt-desc"|
  "updatedAt-asc"|
  "updatedAt-desc"|
  "startDate-asc"|
  "startDate-desc"|
  "endDate-asc"|
  "endDate-desc"

  type SortableNoteFields = "createdAt" | "updatedAt" | "startDate" | "endDate"


  export const SORT_OPTIONS: SortOptionType[] = [
    "createdAt-desc",
    "createdAt-asc",
    "updatedAt-desc",
    "updatedAt-asc",
    "startDate-asc",
    "startDate-desc",
    "endDate-asc",
    "endDate-desc",
  ];

const MoreDialog = ({
  moreDialog,
  moreDialogCategory,
  setMoreDialog,
  handleSelectedNote,
  handleCloseMoreDialog,
}: MoreDialogProps) => {
  const [categoryNotes, setCategoryNotes] = useState<Note[]>([]);
  const [selectedCard, setSelectedCard] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOptionType>("createdAt-desc");

  const todayNotes = useAtomValue(todayNoteAtom);
  const comingUpNotes = useAtomValue(comingUpNoteAtom);
  const unscheduledNotes = useAtomValue(unscheduledNoteAtom);

  const { refetchNotes } = useFetchNotes();

  useEffect(() => {

    let notes: Note[] = []

    switch (moreDialogCategory) {
      case "todayNotes":
        notes = [...todayNotes]
        break;
      case "comingUpNotes":
        notes = [...comingUpNotes]
        break;
      case "unscheduledNotes":
        notes = [...unscheduledNotes]
        break;
        default:
          const _exhaustiveCheck: never = moreDialogCategory
          throw new Error(`${_exhaustiveCheck}は存在しません`)
    }

    const [field, order] = sortOption.split("-") as [SortableNoteFields, "asc" | "desc"]
    const sorted = notes.sort((a,b) => {

      const aValue = a[field] ? new Date(a[field]).getTime() : 0
      const bValue = b[field] ? new Date(b[field]).getTime() : 0

      return order === "asc" ? aValue - bValue : bValue - aValue
    })
    setCategoryNotes(sorted)

  }, [moreDialogCategory, todayNotes, comingUpNotes, unscheduledNotes, sortOption]);

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
          <div className="flex justify-between items-center">
            <DialogTitle>{moreDialogCategory}</DialogTitle>
            <DialogDescription className="sr-only">選択したノートを表示しています</DialogDescription>
            <MoreDialogSort sortOption={sortOption} setSortOption={setSortOption} />
              <div className={`flex items-center gap-2 ${selectedCard.length !== 0  ? "": ""}`}>
                <span>{selectedCard.length}件選択中</span>
                <Button variant={"destructive"} onClick={handleDeleteManyCard}>
                  削除
                </Button>
              </div>
            <DialogClose asChild onClick={handleCloseMoreDialog}>
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
