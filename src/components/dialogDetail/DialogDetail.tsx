import React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Note } from "@prisma/client";
import { Button } from "../ui/button";

interface DialogDetailProps {
  selectedNote: Note;
  setSelectedNote: (note: Note | null) => void;
}

const DialogDetail = ({ selectedNote, setSelectedNote }: DialogDetailProps) => {
  return (
    <Dialog open={selectedNote !== null}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{selectedNote.title}</DialogTitle>
            <DialogClose>
              <Button variant="outline" onClick={() => setSelectedNote(null)}>
                Close
              </Button>
            </DialogClose>
          </div>
          <DialogDescription>{selectedNote.content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">Delete</Button>
          <Button variant="outline">Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetail;
