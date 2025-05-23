"use client";

import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from "react";
import { FormProvider, Path, PathValue, useForm } from "react-hook-form";
import Editor from "@/components/editor/Editor";
import { Card } from "@/components/ui/card";

import FormDatePiceker from "@/components/formContents/FormDatePiceker";
import FormFoldersSelect from "@/components/formContents/FormFoldersSelect";
import FormUnsheduled from "@/components/formContents/FormUnsheduled";
import FormTagInput from "@/components/formContents/FormTagInput";
import { AddNoteDataFrom } from "@/types";
import { addNewNoteActions } from "@/_server-actions/addNewNoteActions";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atom/userAtom";
import { useRouter } from "next/navigation";
import { folderAtom } from "@/atom/noteAtom";
import NoteSubmitButton from "@/components/button/NoteSubmitButton";
import PublicCheck from "@/components/checkbox/PublicCheck";

const addNoteSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(1, { message: "Title is required minimum 1 character" })
    .max(20, { message: "Title is required maximum 20 character" }),
  content: z
    .string()
    .min(1, { message: "Content is required minimum 1 character" }),
  folderName: z.string(),
  tags: z.array(z.string()),
  unScheduled: z.boolean(),
  startDate: z.date(),
  endDate: z.date(),
  public: z.boolean(),
});

const AddNotePage = () => {
  const user = useAtomValue(userAtom);
  const userId = user?.id;

  const router = useRouter();

  const methods = useForm<AddNoteDataFrom>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      id: uuidv4(),
      title: "",
      content: "",
      tags: [],
      unScheduled: false,
      startDate: new Date(),
      endDate: new Date(),
      folderName: "",
      public: true,
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const [newFolder, setNewFolder] = useState<string>("");
  const [selectFolder, setSelectFolder] = useState<string>("");
  const folder = useAtomValue(folderAtom);

  const unScheduled = watch("unScheduled");

  const handleToggleChange = <K extends Path<AddNoteDataFrom>>(key: K) => {
    const current = watch(key) as boolean;
    setValue(key, !current as PathValue<AddNoteDataFrom, K>);
  };

  // 送信、フォルダー選択
  const addNoteSubmit = async (values: AddNoteDataFrom) => {
    let finalFolderName = "";

    if (newFolder.trim() !== "" && selectFolder === "") {
      finalFolderName = newFolder;
    } else if (newFolder.trim() === "" && selectFolder !== "") {
      finalFolderName =
        folder.find((f) => f.id === selectFolder)?.folderName || "";
    } else if (newFolder.trim() !== "" && selectFolder !== "") {
      finalFolderName = newFolder;
    } else {
      return;
    }

    const submitData: AddNoteDataFrom = {
      ...values,
      folderName: finalFolderName,
    };

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
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(addNoteSubmit)}
        className="w-full h-screen flex gap-10 overflow-hidden p-10 pb-30"
      >
        {/* 左コンテンツ */}
        <div className="w-1/2 flex flex-col gap-4">
          <Input
            placeholder="New Note Title"
            className="shadow-sm focus:ring-2 ring-indigo-400"
            {...register("title")}
          />
          <FormTagInput setValue={setValue} watch={watch} />
          <Card className="flex flex-col gap-2 mt-4 p-4 space-y-2">
            <FormUnsheduled
              checked={unScheduled}
              onChange={() => handleToggleChange("unScheduled")}
            />
            <div className="flex gap-2">
              <FormDatePiceker
                title="Start"
                selectedDate={watch("startDate")}
                setSelectedDate={(date) => setValue("startDate", date)}
                disabled={unScheduled}
              />
              <FormDatePiceker
                title="End"
                selectedDate={watch("endDate")}
                setSelectedDate={(date) => setValue("endDate", date)}
                disabled={unScheduled}
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
            <PublicCheck
              checked={watch("public")}
              onChange={() => handleToggleChange("public")}
            />
            <NoteSubmitButton />
          </div>

          {errors.title || errors.content || errors.folderName ? (
            <div>
              <p className="text-red-500 font-bold">入力エラーがあります</p>
              <ul className="list-disc list-inside text-red-500">
                {errors.title && <li>{errors.title.message}</li>}
                {errors.content && <li>{errors.content.message}</li>}
              </ul>
            </div>
          ) : null}
        </div>
        {/* 右コンテンツ */}
        <div className="w-1/2 h-full bg-gray-50 rounded-md p-4 shadow-md overflow-hidden flex-1 flex flex-col">
          <Editor
            markdown={watch("content")}
            onChange={(markdown) =>
              setValue("content", markdown, { shouldValidate: true })
            }
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default AddNotePage;
