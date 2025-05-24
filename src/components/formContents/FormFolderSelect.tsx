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
import { useFormContext } from "react-hook-form";

const FormFolderSelect = () => {
  const folders = useAtomValue(folderAtom);

  const { setValue, watch } = useFormContext();

  const newFolder = watch("newFolder");
  const selectedFolder = watch("selectedFolder");

  return (
    <Select
      disabled={folders.length === 0 || (newFolder?.length ?? 0) > 0}
      value={selectedFolder ?? "unselected"}
      onValueChange={(value) => {
        if (value === "unselected") {
          setValue("selectedFolder", undefined);
          setValue("folderName", "");
        } else {
          setValue("selectedFolder", value);
          const matched = folders.find((f) => f.id === value);
          if (matched) {
            setValue("folderName", matched.folderName);
          }
        }
      }}
    >
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
