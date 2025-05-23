import React from "react";
import { Folder } from "lucide-react";
import { Input } from "../ui/input";
import FormFolderSelect from "./FormFolderSelect";

interface FormFoldersSelectProps {
  newFolder: string;
  setNewFolder: (folder: string) => void;
  selectFolder: string;
  setSelectFolder: (folder: string) => void;
}

const FormFoldersSelect = ({
  setSelectFolder,
  setNewFolder,
  newFolder,
}: FormFoldersSelectProps) => {

  return (
    <div className="w-full mt-4">
      <div className="flex gap-2 items-center mb-1">
        <Folder className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Folders</span>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder="New Folder"
          onChange={(e) => setNewFolder(e.target.value)}
        />
        <FormFolderSelect setSelectFolder={setSelectFolder} newFolder={newFolder}  />
      </div>
    </div>
  );
};

export default FormFoldersSelect;
