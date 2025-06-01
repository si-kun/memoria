import { allNoteAtom } from "@/atom/noteAtom";
import { searchTarmAtom } from "@/atom/searchAtom";
import { useAtomValue } from "jotai";
import React, { useEffect } from "react";
import DialogDetail from "../dialog/DialogDetail";
import { ScrollArea } from "../ui/scroll-area";

const SearchArea = () => {
  const notes = useAtomValue(allNoteAtom);
  const searchTerm = useAtomValue(searchTarmAtom);

  const filterdNotes = notes.filter((note) => note.title.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    console.log(filterdNotes);
  }, [filterdNotes]);

  return (
    <div className="w-[60%] h-[80%]">
      <h3 className="text-2xl font-bold mb-4">
        Search Results {filterdNotes.length} 件
      </h3>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4">
          {filterdNotes.map((note) => (
            <DialogDetail key={note.id} note={note} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchArea;
