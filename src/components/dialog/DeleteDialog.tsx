import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useDeleteDialog } from "@/hooks/useDeleteDialog";
import { SelectedCard, useTrashNote } from "@/hooks/useTrashNote";
import { Note } from "@prisma/client";

interface DeleteDialogProps {
  selectedNote?: Note | null;
  selectedCard?: SelectedCard[] | null;
  setSelectedCard?:  Dispatch<SetStateAction<SelectedCard[]>>
}

const DeleteDialog = ({
  selectedNote,
  selectedCard,
  setSelectedCard,
}: DeleteDialogProps) => {
  const { deleteDialogOpen, setDeleteDialogOpen } = useDeleteDialog();
  const { handleDeleteCard } = useTrashNote();

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Delete</Button>
      </DialogTrigger>
      <DialogContent className="w-[50%]">
        <DialogHeader>
          <DialogTitle>
            {}
            <div>
              {selectedCard?.map((card) => (
                <p key={card.id}>{card.title}</p>
              ))}
            </div>
            {selectedNote?.title} を完全に削除してもよろしいですか？
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            <span>
              Yes
              をクリックすると、このノートは完全に削除され、復元できなくなります。
            </span>
            <span>キャンセルするには No を押してください</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={() => {
              handleDeleteCard(selectedNote?.id as string);
              setDeleteDialogOpen(false);
              if (setSelectedCard)
                setSelectedCard((prev) =>
                  prev.filter((id) => id !== selectedNote?.id)
                );
            }}
          >
            Yes
          </Button>
          <Button
            className="bg-green-400 hover:bg-green-300"
            variant={"outline"}
            onClick={() => setDeleteDialogOpen(false)}
          >
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
