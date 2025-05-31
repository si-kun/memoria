import { MORE_CATEGORY } from "@/app/(private)/page";
import {
  comingUpNoteAtom,
  favoriteNoteAtom,
  todayNoteAtom,
  trashNoteAtom,
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
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { deleteManyNoteCard } from "@/_server-actions/note/deleteManyNoteCard";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useFetchNotes } from "@/hooks/useFetchNotes";
import MoreDialogSort from "../select/MoreDialogSort";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { useMoreDialog } from "@/hooks/useMoreDialog";
import DialogDetail from "./DialogDetail";
import DeleteDialog from "./DeleteDialog";
import { SelectedCard, useTrashNote } from "@/hooks/useTrashNote";

interface MoreDialogProps {
  moreDialogCategory: MORE_CATEGORY;
  handleSelectedNote: (id: string) => void;
}

type SortableNoteFields = "createdAt" | "updatedAt" | "startDate" | "endDate";

export const SORT_OPTIONS = [
  "createdAt-desc",
  "createdAt-asc",
  "updatedAt-desc",
  "updatedAt-asc",
  "startDate-asc",
  "startDate-desc",
  "endDate-asc",
  "endDate-desc",
] as const;

export type SortOptionType = (typeof SORT_OPTIONS)[number];

const MoreDialog = ({ moreDialogCategory }: MoreDialogProps) => {
  const [categoryNotes, setCategoryNotes] = useState<Note[]>([]);
  const [sortOption, setSortOption] =
    useState<SortOptionType>("createdAt-desc");

  const todayNotes = useAtomValue(todayNoteAtom);
  const comingUpNotes = useAtomValue(comingUpNoteAtom);
  const unscheduledNotes = useAtomValue(unscheduledNoteAtom);
  const favoriteNotes = useAtomValue(favoriteNoteAtom);
  const trashNotes = useAtomValue(trashNoteAtom);

  const { moreDialog, setMoreDialog } = useMoreDialog();
  const {
    handleSelectCard,
    selectedCard,
    setSelectedCard,
    handleMoveToManyTrashNote,
  } = useTrashNote();

  const { refetchNotes } = useFetchNotes();

  useEffect(() => {
    let notes: Note[] = [];

    switch (moreDialogCategory) {
      case "todayNotes":
        notes = [...todayNotes];
        break;
      case "comingUpNotes":
        notes = [...comingUpNotes];
        break;
      case "unscheduledNotes":
        notes = [...unscheduledNotes];
        break;
      case "favoriteNotes":
        notes = [...favoriteNotes];
        break;
      case "trashNotes":
        notes = [...trashNotes];
        break;
      default:
        const _exhaustiveCheck: never = moreDialogCategory;
        throw new Error(`${_exhaustiveCheck}は存在しません`);
    }

    const [field, order] = sortOption.split("-") as [
      SortableNoteFields,
      "asc" | "desc"
    ];
    const sorted = notes.sort((a, b) => {
      const aValue = a[field] ? new Date(a[field]).getTime() : 0;
      const bValue = b[field] ? new Date(b[field]).getTime() : 0;

      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
    setCategoryNotes(sorted);
  }, [
    moreDialogCategory,
    todayNotes,
    comingUpNotes,
    unscheduledNotes,
    favoriteNotes,
    trashNotes,
    sortOption,
  ]);

  useEffect(() => {
    if (!moreDialog) {
      setSelectedCard([]);
    }
  }, [moreDialog]);

  useEffect(() => {
    // 現在のカテゴリーノート一覧に存在しないIDを selectedCard から除外
    setSelectedCard((prev) =>
      prev.filter((card) => categoryNotes.some((note) => note.id === card.id))
    );
  }, [categoryNotes]);

  // const handleDeleteManyCard = async () => {
  //   const res = await deleteManyNoteCard(selectedCard);

  //   if (res.message) {
  //     toast.success(res.message);
  //     setSelectedCard([]);
  //     refetchNotes();
  //     setMoreDialog(false);
  //   }

  //   if (res.error) {
  //     toast.error(res.error);
  //   }
  // };

  return (
    <Dialog open={moreDialog} onOpenChange={setMoreDialog}>
      <DialogTrigger asChild className="ml-auto">
        <Button variant="link" onClick={() => setMoreDialog(true)}>
          more...
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[60%] h-[70%] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle>{moreDialogCategory}</DialogTitle>
            <DialogDescription className="sr-only">
              選択したノートを表示しています
            </DialogDescription>
            <MoreDialogSort
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
            <div
              className={`flex items-center gap-2 ${
                selectedCard.length !== 0 ? "" : ""
              }`}
            >
              <span>{selectedCard.length}件選択中</span>
              {moreDialogCategory === "trashNotes" ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant={"secondary"}
                    className="bg-green-400 hover:bg-green-300"
                    onClick={handleMoveToManyTrashNote}
                  >
                    Restore
                  </Button>
                  {/* <Button
                    variant={"destructive"}
                    onClick={handleDeleteManyCard}
                  >
                    Delete
                  </Button> */}
                  <DeleteDialog
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                  />
                </div>
              ) : (
                <Button
                  variant={"destructive"}
                  onClick={handleMoveToManyTrashNote}
                >
                  Move To Trash
                </Button>
              )}
            </div>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setMoreDialog(false)}>
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* 🔥←ここでScrollAreaがflex-1で残り全部になる */}
        <ScrollArea className="flex-1 h-[70%] w-full">
          <div className="flex flex-col gap-3 pb-3 w-full">
            {categoryNotes.map((note) => (
              <div key={note.id} className="flex items-center gap-1 w-full">
                <Checkbox
                  checked={selectedCard.some(
                    (card: SelectedCard) => card.id === note.id
                  )}
                  onCheckedChange={() => handleSelectCard(note)}
                />
                <DialogDetail note={note} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MoreDialog;
