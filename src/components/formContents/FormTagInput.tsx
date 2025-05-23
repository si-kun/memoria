import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { AddNoteDataFrom } from "@/types";

interface FormTagInputProps {
  watch: UseFormWatch<AddNoteDataFrom>;
  setValue: UseFormSetValue<AddNoteDataFrom>;
}

const FormTagInput = ({ setValue, watch }: FormTagInputProps) => {
  const [tagInput, setTagInput] = useState<string>("");
  const [displayTags, setDisplayTags] = useState<string[]>([]);
  const watchedTags = watch("tags");

  useEffect(() => {
    if (Array.isArray(watchedTags)) {
      setDisplayTags(watchedTags);
    } else {
      setValue("tags", []);
      setDisplayTags([]);
    }
  }, [watchedTags, setValue]);

  const handleTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setTagInput(currentValue);

    if (currentValue.includes(",")) {
      // カンマがある場合、タグリストを作成
      const tagList = currentValue
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

      setValue("tags", tagList);
    } else if (currentValue === "") {
      // 空の場合、タグリストをクリア
      setValue("tags", []);
    } else {
      // カンマがない場合、現在の入力を一時的なタグとして扱う
      const tempTag = currentValue.trim();
      if (tempTag) {
        const formattedTag = tempTag.startsWith("#") ? tempTag : `#${tempTag}`;
        setValue("tags", [formattedTag]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <ul className="flex gap-2">
        {displayTags.length === 0 ? (
          <li className="bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-500 italic">
            No tags
          </li>
        ) : (
          displayTags.map((tag) => (
            <li className="bg-gray-100 px-2 py-1 rounded-md" key={tag}>
              {tag}
            </li>
          ))
        )}
      </ul>
      <Input
        placeholder="Tags"
        value={tagInput}
        onChange={handleTags}
      />
    </div>
  );
};

export default FormTagInput;
