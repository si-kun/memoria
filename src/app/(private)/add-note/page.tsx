"use client";

import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import Editor from "@/components/editor/Editor";
import { Card } from "@/components/ui/card";

import FormDatePiceker from "@/components/formContents/FormDatePiceker";
import FormFoldersSelect from "@/components/formContents/FormFoldersSelect";
import FormUnsheduled from "@/components/formContents/FormUnsheduled";
import FormTagInput from "@/components/formContents/FormTagInput";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AddNoteDataFrom } from "@/types";
import { addNewNoteActions } from "@/_server-actions/addNewNoteActions";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atom/userAtom";
import { useRouter } from "next/navigation";

export type ToggleKey = keyof Pick<AddNoteDataFrom, "unScheduled" | "public">;

const addNoteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required minimum 1 character" })
    .max(20, { message: "Title is required maximum 20 character" }),

  content: z
    .string()
    .min(1, { message: "Content is required minimum 1 character" }),

    folderName: z.string()
});

const AddNotePage = () => {
  const user = useAtomValue(userAtom);
  const userId = user?.id;

  const router = useRouter();

  const [addNoteData, setAddNoteData] = useState<AddNoteDataFrom>({
    id: uuidv4(),
    title: "",
    tags: [],
    unScheduled: false,
    startDate: new Date(),
    endDate: new Date(),
    folderName: "",
    public: true,
    content: "",
  });

  const [tagInput, setTagInput] = useState<string>("");
  const [newFolder, setNewFolder] = useState<string>("");
  const [selectFolder, setSelectFolder] = useState<string>("");

  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>("");
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);

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

      setAddNoteData({ ...addNoteData, tags: tagList });
    } else if (currentValue === "") {
      // 空の場合、タグリストをクリア
      setAddNoteData({ ...addNoteData, tags: [] });
    } else {
      // カンマがない場合、現在の入力を一時的なタグとして扱う
      const tempTag = currentValue.trim();
      if (tempTag) {
        const formattedTag = tempTag.startsWith("#") ? tempTag : `#${tempTag}`;
        setAddNoteData({ ...addNoteData, tags: [formattedTag] });
      }
    }
  };

  const handleInputInputChange = <K extends keyof AddNoteDataFrom>(
    key: K,
    value: AddNoteDataFrom[K]
  ) => {
    setAddNoteData((prev) => ({ ...prev, [key]: value }));

    console.log(addNoteData);
  };

  const handleToggleChange = (checked: boolean, key: ToggleKey) => {
    setAddNoteData((prev) => ({ ...prev, [key]: checked }));

    console.log(addNoteData);
  };

  // 送信、フォルダー選択
  const addNoteSubmit = async () => {
    if (newFolder.trim() !== "" && selectFolder === "") {
      setAddNoteData((prev) => ({
        ...prev,
        folderName: newFolder,
      }));
    } else if (newFolder.trim() === "" && selectFolder !== "") {
      setAddNoteData((prev) => ({
        ...prev,
        folderName: selectFolder,
      }));
    } else {
      setAlertDialogOpen(true);
      setSubmitErrorMessage("Please select or create a folder");
    }

    const submitData: AddNoteDataFrom = {
      ...addNoteData,
      folderName: newFolder.trim() !== "" ? newFolder : selectFolder,
    };

    const result = addNoteSchema.safeParse(submitData);

    if (!result.success) {
      setSubmitErrorMessage(result.error.message);
      toast.error("入力に誤りがあります");
      console.error(result.error.format())
      return;
    }

    try {
      if (userId) {
        const result = await addNewNoteActions(submitData, userId);

        if (result.success) {
          console.log("submit");
          console.log(submitData);

          toast.success("Note created successfully");
          router.replace("/");
        } else {
          toast.error("Note creation failed");
        }
      }
    } catch (error) {
      toast.error("Note creation failed");
      console.log(error);
    }
  };

  return (
    <form className="w-full h-screen flex gap-10 overflow-hidden p-10 pb-30">
      {/* 左コンテンツ */}
      <div className="w-1/2 flex flex-col gap-4">
        <Input
          placeholder="New Note Title"
          className="shadow-sm focus:ring-2 ring-indigo-400"
          onChange={(e) => handleInputInputChange("title", e.target.value)}
        />
        <FormTagInput
          tags={addNoteData.tags}
          value={tagInput}
          handleTags={handleTags}
        />
        <Card className="flex flex-col gap-2 mt-4 p-4 space-y-2">
          <FormUnsheduled
            checked={addNoteData.unScheduled}
            onChange={(checked) => handleToggleChange(checked, "unScheduled")}
          />
          <div className="flex gap-2">
            <FormDatePiceker
              title="Start"
              selectedDate={addNoteData.startDate}
              setSelectedDate={(date) =>
                setAddNoteData({ ...addNoteData, startDate: date })
              }
              disabled={addNoteData.unScheduled}
            />
            <FormDatePiceker
              title="End"
              selectedDate={addNoteData.endDate}
              setSelectedDate={(date) =>
                setAddNoteData({ ...addNoteData, endDate: date })
              }
              disabled={addNoteData.unScheduled}
            />
          </div>
          <FormFoldersSelect
            newFolder={newFolder}
            setNewFolder={setNewFolder}
            selectFolder={selectFolder}
            setSelectFolder={setSelectFolder}
          />
        </Card>
        <div className="flex items-center justify-end gap-5">
          <div className="flex items-center gap-1">
            <Checkbox
              id="public"
              checked={addNoteData.public}
              onCheckedChange={(checked) =>
                handleToggleChange(checked as boolean, "public")
              }
            />
            <label htmlFor="public">Public</label>
          </div>
          <Button
            type="button"
            className="cursor-pointer bg-indigo-400 hover:bg-indigo-500"
            onClick={addNoteSubmit}
          >
            <Import />
            <span>Save</span>
          </Button>
        </div>
      </div>
      {/* 右コンテンツ */}
      <div className="w-1/2 h-full bg-gray-50 rounded-md p-4 shadow-md overflow-hidden flex-1 flex flex-col">
        <Editor
          markdown={addNoteData.content}
          onChange={(e) => handleInputInputChange("content", e.target.value)}
        />
      </div>
    </form>
  );
};

export default AddNotePage;
