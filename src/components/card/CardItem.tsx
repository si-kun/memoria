import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight, Star } from "lucide-react";
import { Note } from "@prisma/client";

interface CardItemProps {
  note: Note;
}

const CardItem = ({ note }: CardItemProps) => {

  const { title, isFavorite, isUnscheduled,startDate,endDate} = note;

  return (
    <Card
      className="flex flex-col w-full gap-0 relative hover:shadow-lg cursor-pointer transition-all duration-300 py-2"
    >
      <CardHeader className="text-lg font-bold flex items-center gap-1">
        {isFavorite && (
          <Star fill="currentColor" className="text-yellow-300 w-5 h-5" />
        )}
        {title}
      </CardHeader>
      <CardContent className="text-sm text-gray-500 flex items-center gap-3">
        {isUnscheduled ? (
          <span className="text-red-500">not Date</span>
        ) : (
          <span className={`${endDate && endDate< new Date() ? "text-red-500 font-bold" : ""}`}>
            {startDate?.toDateString()} - {endDate?.toDateString()}
          </span>
        )}
      </CardContent>
      <Button className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none pointer-events-none hover:bg-transparent">
        <ChevronRight className="w-4 h-4 text-black" />
      </Button>
    </Card>
  );
};

export default CardItem;
