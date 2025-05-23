import React, { Dispatch} from "react";
import { Card } from "../ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import CardItem from "./CardItem";
import { Button } from "../ui/button";
import { Note } from "@prisma/client";
import { SetStateAction } from "jotai";
import { MORE_CATEGORY } from "@/app/(private)/page";

interface AccordionCardProps {
  item: {
    id: string;
    value: string;
    title: string;
    unScheduled: boolean;
    notes: Note[];
  };
  handleSelectedNote: (id: string) => void;
  setMoreDialog: (moreDialog: boolean) => void;
  setMoreDialogCategory: Dispatch<SetStateAction<MORE_CATEGORY>>;
}

const AccordionCard = ({
  item,
  handleSelectedNote,
  setMoreDialog,
  setMoreDialogCategory,
}: AccordionCardProps) => {
  return (
    <Card
      key={item.value}
      className="bg-gray-100 w-full h-auto rounded-lg p-4 flex flex-col gap-4"
    >
      <AccordionItem value={item.value}>
        <AccordionTrigger
          className="font-bold text-lg p-1"
          onClick={() => setMoreDialogCategory(item.id as MORE_CATEGORY)}
        >
          {item.title}
        </AccordionTrigger>

        <AccordionContent className="flex flex-col gap-2 p-0">
          {item.notes.length === 0 ? (
            <div className="flex h-full">
              <p className="text-gray-500">No notes</p>
            </div>
          ) : (
            item.notes
              .slice(0, 5)
              .map((note) => (
                <CardItem
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  unScheduled={note.unScheduled}
                  startDate={note.startDate}
                  endDate={note.endDate}
                  handleSelectedNote={handleSelectedNote}
                />
              ))
          )}
          {item.notes.length > 5 && (
            <Button
              asChild
              variant="link"
              className="w-[100px] ml-auto cursor-pointer"
              onClick={() => setMoreDialog(true)}
            >
              <span>more...</span>
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};

export default AccordionCard;
