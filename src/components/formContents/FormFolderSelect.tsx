import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtomValue } from "jotai";
import { folderAtom } from "@/atom/noteAtom";

interface FormFolderSelectProps {
  setSelectFolder: (folder: string) => void;
  newFolder: string;
}

const FormFolderSelect = ({
  setSelectFolder,
  newFolder,
}: FormFolderSelectProps) => {
  const folders = useAtomValue(folderAtom);

  return (
    <Select disabled={folders.length === 0 || newFolder.length > 0} onValueChange={(value) => {
      if (value === "unselected") {
        setSelectFolder("");
      } else {
        setSelectFolder(value);
      }
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a folder" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Folders</SelectLabel>
          <SelectItem value="unselected">未設定</SelectItem>
          {folders.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.folderName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FormFolderSelect;
