import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useFormContext } from "react-hook-form";

interface FormTagInputProps {
  defaultValues: string[];
}

const FormTagInput = ({ defaultValues }: FormTagInputProps) => {

  const {setValue,watch} = useFormContext();

  const [tagInput, setTagInput] = useState<string>(defaultValues.join(","));

  const tags: string[] = watch("tags");

  useEffect(() => {
    if (defaultValues.length > 0) {
      setValue("tags", defaultValues);
    }
  }, [defaultValues, setValue]);

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setTagInput(currentValue);

    const tagList = currentValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

    setValue("tags", tagList);
  };

  return (
    <div className="flex flex-col gap-1">
      <ul className="flex gap-2">
        {tags.length === 0 ? (
          <li className="bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-500 italic">
            No tags
          </li>
        ) : (
          tags.map((tag, i) => (
            <li className="bg-gray-100 px-2 py-1 rounded-md" key={i}>
              {tag}
            </li>
          ))
        )}
      </ul>
      <Input placeholder="Tags" value={tagInput} onChange={handleTagInput} />
    </div>
  );
};

export default FormTagInput;
