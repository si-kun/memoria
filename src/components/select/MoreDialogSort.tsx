import React, { Dispatch, SetStateAction } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, SortOptionType } from "../dialog/MoreDialog";

interface MoreDialogSortProps {
  sortOption: SortOptionType;
  setSortOption: Dispatch<SetStateAction<SortOptionType>>;
}

const MoreDialogSort = ({ sortOption, setSortOption }: MoreDialogSortProps) => {
  return (
    <Select   value={sortOption} // ← これ必要
    onValueChange={(value) => setSortOption(value as SortOptionType)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option.replace(/-/g, " ")}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MoreDialogSort;
