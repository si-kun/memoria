import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import DeleteDialog from "./DeleteDialog";
import { useTrashNote } from "@/hooks/useTrashNote";

interface CalendarNoteDialogProps {
  note: Note;
  calendarNoteDialog: boolean;
  setCalendarNoteDialog: (calendarNoteDialog: boolean) => void;
}

const CalendarNoteDialog = ({
  note,
  calendarNoteDialog,
  setCalendarNoteDialog,
}: CalendarNoteDialogProps) => {
  const router = useRouter();
  const { handleMoveToTrash } = useTrashNote();

  if (!note) return null;

  const titleSlug = encodeURIComponent(note.title as string);
  const slug = `${titleSlug}-${note.id}`;

  if (!note) return null;

  const isTrashed = note.deletedAt !== null;

  return (
    <Dialog open={calendarNoteDialog} onOpenChange={setCalendarNoteDialog}>
      <DialogContent className="w-[50%]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {note.favorite && (
                <Star fill="currentColor" className="text-yellow-300 w-5 h-5" />
              )}
              <DialogTitle>{note.title}</DialogTitle>
            </div>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
          <DialogDescription>{note.content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={isTrashed ? "secondary" : "destructive"}
            onClick={() => {
              handleMoveToTrash(note.id as string);
              setCalendarNoteDialog(false);
            }}
            className={`${isTrashed ? "bg-green-400 hover:bg-green-300" : ""}`}
          >
            {isTrashed ? "Restore" : "Move To Trash"}
          </Button>
          {/* Delete Dialog */}
          {isTrashed && <DeleteDialog />}

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

export default CalendarNoteDialog;
