import React from "react";
import { Folder } from "lucide-react";
import { Input } from "../ui/input";
import FormFolderSelect from "./FormFolderSelect";
import { useFormContext } from "react-hook-form";

const FormFoldersSelect = () => {
  const { register, setValue, watch } = useFormContext();

  return (
    <div className="w-full mt-4">
      <div className="flex gap-2 items-center mb-1">
        <Folder className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Folders</span>
      </div>
      <div className="flex gap-2 items-center">
        <Input placeholder="New Folder" value={watch("newFolder")} {...register("newFolder")} onChange={(e) => {
          const value = e.target.value;
          setValue("newFolder", value);
          setValue("folderName", value);
        }} />
        <FormFolderSelect />
      </div>
    </div>
  );
};

export default FormFoldersSelect;
