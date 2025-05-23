import React from "react";

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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface DialogDetailProps {
  selectedNote: Note;
  setSelectedNote: (note: Note | null) => void;
  handleDeleteNote: (id: string) => void;
}

const DialogDetail = ({
  selectedNote,
  setSelectedNote,
  handleDeleteNote,
}: DialogDetailProps) => {

  const router = useRouter()

  const titleSlug = encodeURIComponent(selectedNote.title)
  const slug = `${titleSlug}-${selectedNote.id}`

  return (
    <Dialog open={selectedNote !== null}>
      <DialogContent className="w-[50%]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{selectedNote.title}</DialogTitle>
            <DialogClose asChild onClick={() => setSelectedNote(null)}>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
          <DialogDescription>{selectedNote.content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => handleDeleteNote(selectedNote.id)}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.push(`/edit/${slug}`)}>Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetail;
