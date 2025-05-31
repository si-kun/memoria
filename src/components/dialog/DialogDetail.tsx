import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Note } from "@prisma/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import DeleteDialog from "./DeleteDialog";
import { useTrashNote } from "@/hooks/useTrashNote";
import CardItem from "../card/CardItem";
import { useDialogTrigger } from "@/hooks/useDialogTrigger";

interface DialogDetailProps {
  note: Note | null;
}

const DialogDetail = ({ note }: DialogDetailProps) => {
  const router = useRouter();

  const { selectedNote, setSelectedNote, handleMoveToTrash} = useTrashNote();

  const { cardDialog, setCardDialog } = useDialogTrigger();

  if (!note) return null;

  const titleSlug = encodeURIComponent(selectedNote?.title as string);
  const slug = `${titleSlug}-${selectedNote?.id}`;

  if (!note) return null;

  const handleOpenChange = (newOpen: boolean) => {
    setCardDialog(newOpen);
    if (!newOpen) {
      setTimeout(() => setSelectedNote(null), 200);
    }
  };

  const isTrashed = selectedNote?.deletedAt !== null;

  return (
    <Dialog open={cardDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild className="w-full">
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedNote(note);
            setCardDialog(true);
          }}
        >
          <CardItem note={note} />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[50%]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {note?.favorite && (
                <Star fill="currentColor" className="text-yellow-300 w-5 h-5" />
              )}
              <DialogTitle>{note?.title}</DialogTitle>
            </div>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
          <DialogDescription>{note?.content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={isTrashed ? "secondary" : "destructive"}
            onClick={() => handleMoveToTrash(note?.id as string)}
            className={`${isTrashed ? "bg-green-400 hover:bg-green-300" : ""}`}
          >
            {isTrashed ? "Restore" : "Move To Trash"}
          </Button>
          {/* Delete Dialog */}
          {isTrashed && <DeleteDialog selectedNote={selectedNote} />}

          {/* Edit Button */}
          <Button
            variant="outline"
            onClick={() => router.push(`/edit/${slug}`)}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetail;
