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
import { Folder } from "lucide-react";
import { Input } from "../ui/input";
import { useAtomValue } from "jotai";
import { folderAtom } from "@/atom/noteAtom";

interface FormFoldersSelectProps {
  newFolder: string;
  setNewFolder: (folder: string) => void;
  selectFolder: string;
  setSelectFolder: (folder: string) => void;
}

const FormFoldersSelect = ({
  newFolder,
  setNewFolder,
  selectFolder,
  setSelectFolder,
}: FormFoldersSelectProps) => {
  const folder = useAtomValue(folderAtom);

  return (
    <div className="w-full mt-4">
      <div className="flex gap-2 items-center mb-1">
        <Folder className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Folders</span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="New Folder"
          value={newFolder}
          onChange={(e) => setNewFolder(e.target.value)}
        />
        <Select
          disabled={newFolder.length >= 1}
          value={selectFolder}
          onValueChange={setSelectFolder}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Folders</SelectLabel>
              <SelectItem value="unselected">未設定</SelectItem>
              {folder.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.folderName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FormFoldersSelect;
