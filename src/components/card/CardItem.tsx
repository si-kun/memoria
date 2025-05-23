import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

interface CardItemProps {
  id: string;
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  unScheduled: boolean;
  handleSelectedNote: (id: string) => void;
}

const CardItem = ({
  id,
  title,
  startDate,
  endDate,
  unScheduled,
  handleSelectedNote,
}: CardItemProps) => {
  return (
      <Card
        key={id}
        className="flex flex-col w-full gap-0 relative hover:shadow-lg cursor-pointer transition-all duration-300 py-2"
        onClick={() => handleSelectedNote(id)}
      >
        <CardHeader className="text-lg font-bold">{title}</CardHeader>
        <CardContent className="text-sm text-gray-500 flex items-center gap-3">
          {unScheduled ? (
            <span className="text-red-500">not Date</span>
          ) : (
            <span>
              {startDate?.toDateString()} - {endDate?.toDateString()}
            </span>
          )}
        </CardContent>
        <Button className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none shadow-none hover:bg-transparent">
          <ChevronRight className="w-4 h-4 text-black" />
        </Button>
      </Card>
  );
};

export default CardItem;
